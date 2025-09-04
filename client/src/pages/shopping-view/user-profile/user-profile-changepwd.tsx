import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { changePassword } from "@/store/shop/user-profile-slice";
import Form from "@/components/common/form";
import { changePasswordFormControls } from "@/config";

const ChangePassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(
    (state: RootState) => state.shopUserProfile
  );

  const handleSubmit = (values: Record<string, string>) => {
    const { oldPassword, newPassword } = values;
    dispatch(changePassword({ oldPassword, newPassword }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>

      <Form
        controls={changePasswordFormControls}
        onSubmit={handleSubmit}
        submitText="Đổi mật khẩu"
        loading={loading}
        errors={error ? { general: error } : undefined}
      />
    </div>
  );
};

export default ChangePassword;
