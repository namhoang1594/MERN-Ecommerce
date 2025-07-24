import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Addresses } from "../../store/shop/address-slice/address.types";

interface AddressCardProps {
  addressInfo: Addresses;
  handleEditAddress: (address: Addresses) => void;
  handleDeleteAddress: (address: Addresses) => void;
  setCurrentSelectedAddress?: (address: Addresses) => void;
  selectedId?: { _id: string } | null;
}

function AddressCard({
  addressInfo,
  handleEditAddress,
  handleDeleteAddress,
  setCurrentSelectedAddress,
  selectedId,
}: AddressCardProps) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : undefined
      }
      className={`cursor-pointer border-red-700 ${
        isSelected ? "border-red-900 border-[5px]" : "border-black"
      }`}
    >
      <CardContent className={`grid gap-4 p-4`}>
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="flex justify-between p-2">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
