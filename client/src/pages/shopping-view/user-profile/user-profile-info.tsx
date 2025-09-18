import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Button } from "@/components/ui/button";
import { UploadedResult } from "@/types/config/index.types";
import { fetchProfile, updateProfile } from "@/store/shop/user-profile-slice";
import ImageUpload from "@/components/common/image-upload";
import Form from "@/components/common/form";
import { userProfileFormControls } from "@/config";
import {
  Address,
  TabType,
  UserProfile,
} from "@/store/shop/user-profile-slice/user-profile.types";

const getDefaultValues = (
  userInfo: UserProfile | null
): Record<string, string> => {
  if (!userInfo) return {};

  return {
    name: userInfo.name || "",
    email: userInfo.email || "",
    phone: userInfo.phone || "",
  };
};

const getDefaultAddressText = (addresses: Address[]): string => {
  const defaultAddress = addresses?.find((addr) => addr.isDefault);
  return defaultAddress
    ? `Địa chỉ mặc định: ${defaultAddress.street}, ${defaultAddress.ward}, ${defaultAddress.province}`
    : "Chưa có địa chỉ mặc định";
};

export default function ProfileInfo({
  setActiveTab,
}: {
  setActiveTab: (tab: TabType) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { info, addresses, loading } = useSelector(
    (state: RootState) => state.shopUserProfile
  );
  const { defaultAddress } = useSelector(
    (state: RootState) => state.shopUserProfile
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedResult, setUploadedResult] = useState<UploadedResult | null>(
    null
  );
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (info?.avatar) {
      setUploadedResult({
        url: info.avatar.url,
        public_id: info.avatar.public_id,
      });
    }
  }, [info]);

  const handleSubmit = (values: Record<string, string>) => {
    const updateData: any = { ...values };
    // Chỉ gửi avatar nếu có thay đổi so với avatar hiện tại
    if (uploadedResult && uploadedResult !== info?.avatar) {
      updateData.avatar = uploadedResult;
    }
    dispatch(updateProfile(updateData));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>

      {/* Avatar + Form Info */}
      <div className="flex gap-8">
        {/* Avatar khối riêng */}
        <div className="w-1/3 max-w-xs">
          <ImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedResult={uploadedResult}
            setUploadedResult={setUploadedResult}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={false}
            uploadApiUrl="http://localhost:5000/api/upload-image"
            uploadFolder="avatars"
            label="Avatar"
          />
        </div>

        {/* Form Info */}
        <div className="flex-1">
          <Form
            controls={userProfileFormControls}
            defaultValues={getDefaultValues(info)}
            onSubmit={handleSubmit}
            submitText="Lưu thay đổi"
            loading={loading}
          />
        </div>
      </div>

      {/* Địa chỉ mặc định */}
      <div className="border rounded-xl p-4 bg-gray-50">
        <h3 className="font-medium mb-3">Địa chỉ mặc định</h3>
        {defaultAddress ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">Họ và tên</label>
                <input
                  type="text"
                  value={defaultAddress.fullName}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={defaultAddress.phone}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600">Địa chỉ</label>
                <input
                  type="text"
                  value={`${defaultAddress.street}, ${defaultAddress.ward}, ${defaultAddress.province}`}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-sm"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="link"
              className="mt-2 px-0 text-sm text-blue-600"
              onClick={() => setActiveTab("addresses")}
            >
              Thay đổi địa chỉ
            </Button>
          </>
        ) : (
          <p className="text-gray-500 text-sm">Chưa có địa chỉ nào</p>
        )}
      </div>
    </div>
  );
}
