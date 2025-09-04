import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Address } from "@/store/shop/user-profile-slice/user-profile.types";
import {
  addAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
} from "@/store/shop/user-profile-slice";

import Form from "@/components/common/form";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/common/confirm-modal";
import { addressFormControls } from "@/config";

const AddressList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, loading, error } = useSelector(
    (state: RootState) => state.shopUserProfile // Sửa selector name
  );

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null); // Type safety
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const getDefaultValues = (
    address: Address | null
  ): Record<string, string> => {
    if (!address) {
      return {
        fullName: "",
        phone: "",
        street: "",
        ward: "",
        province: "",
      };
    }

    return {
      fullName: address.fullName || "",
      phone: address.phone || "",
      street: address.street || "",
      ward: address.ward || "",
      province: address.province || "",
    };
  };

  const handleSave = (values: Record<string, string>) => {
    const addressData: Omit<Address, "_id"> = {
      fullName: values.fullName || "",
      phone: values.phone || "",
      street: values.street || "",
      ward: values.ward || "",
      province: values.province || "",
      isDefault: false,
    };
    if (editing) {
      dispatch(updateAddress({ id: editing._id, data: addressData }));
    } else {
      dispatch(addAddress(addressData));
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (address: Address) => {
    setEditing(address);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deleteAddress(deleteId));
    }
    setDeleteId(null);
  };

  const handleSetDefault = (addressId: string) => {
    dispatch(setDefaultAddress(addressId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Địa chỉ</h2>
        <Button onClick={() => setShowForm(true)}>Thêm địa chỉ</Button>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-4">
            {editing ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
          </h3>

          <Form
            controls={addressFormControls}
            defaultValues={getDefaultValues(editing)}
            onSubmit={handleSave}
            submitText={editing ? "Cập nhật" : "Thêm địa chỉ"}
            loading={loading}
          />

          <Button variant="outline" onClick={handleCancelForm} className="mt-2">
            Hủy
          </Button>
        </div>
      )}

      {/* Address list */}
      <div className="space-y-4">
        {loading && addresses.length === 0 ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : addresses.length === 0 ? (
          <p className="text-center text-gray-500">Chưa có địa chỉ nào</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className="p-4 border rounded-xl flex items-start justify-between"
            >
              <div className="flex-1">
                <p className="font-medium">{addr.fullName}</p>
                <p className="text-sm text-gray-500">{addr.phone}</p>
                <p className="text-sm">
                  {addr.street}, {addr.ward}, {addr.province}
                </p>
                {addr.isDefault && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                    Mặc định
                  </span>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                {!addr.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(addr._id)}
                    disabled={loading}
                  >
                    Đặt mặc định
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(addr)}
                  disabled={loading}
                >
                  Sửa
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteId(addr._id)}
                  disabled={loading}
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm delete modal */}
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa địa chỉ"
        description="Bạn có chắc muốn xóa địa chỉ này không?"
        confirmText="Xóa"
      />
    </div>
  );
};

export default AddressList;
