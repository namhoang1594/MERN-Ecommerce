// components/shopping-view/address.tsx
import { useEffect, useState, FormEvent } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteaAddress,
  editaAddress,
  fetchAllAddress,
} from "../../store/shop/address-slice/index";
import AddressCard from "./address-card";
import { toast } from "sonner";
import { RootState, AppDispatch } from "../../store/store";
import {
  AddressFormData,
  Addresses,
} from "../../store/shop/address-slice/address.types";

interface AddressProps {
  setCurrentSelectedAddress?: (address: Addresses) => void;
  selectedId?: { _id: string } | null;
}

const initialAddressFormData: AddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }: AddressProps) {
  const [formData, setFormData] = useState<AddressFormData>(
    initialAddressFormData
  );
  const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { addressList } = useSelector((state: RootState) => state.shopAddress);

  const handleManageAddress = (event: FormEvent) => {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast.warning("You can add max 3 addresses");
      return;
    }

    if (currentEditedId !== null) {
      dispatch(
        editaAddress({
          userId: user?.id,
          addressId: currentEditedId,
          formData,
        })
      ).then((data: any) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddress(user?.id));
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          toast.success("Edited address successfully!");
        }
      });
    } else {
      dispatch(
        addNewAddress({
          ...formData,
          userId: user?.id,
        })
      ).then((data: any) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddress(user?.id));
          setFormData(initialAddressFormData);
          toast.success("Added address successfully!");
        }
      });
    }
  };

  const isFormValid = () => {
    return Object.values(formData)
      .map((value) => value?.trim() !== "")
      .every((item) => item);
  };

  const handleDeleteAddress = (currentAddress: Addresses) => {
    dispatch(
      deleteaAddress({
        userId: user?.id,
        addressId: currentAddress._id,
      })
    ).then((data: any) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddress(user?.id));
        toast.success("Deleted address successfully!");
      }
    });
  };

  const handleEditAddress = (currentAddress: Addresses) => {
    setCurrentEditedId(currentAddress._id);
    setFormData({
      address: currentAddress?.addressLine1 || "",
      city: currentAddress?.city || "",
      phone: currentAddress?.phoneNumber || "",
      pincode: currentAddress?.postalCode || "",
      notes: currentAddress?.notes || "",
    });
  };

  useEffect(() => {
    dispatch(fetchAllAddress(user?.id));
  }, [dispatch, user?.id]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList?.length > 0 &&
          addressList.map((singleAddressItem) => (
            <AddressCard
              key={singleAddressItem._id}
              selectedId={selectedId}
              addressInfo={singleAddressItem}
              handleDeleteAddress={handleDeleteAddress}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
