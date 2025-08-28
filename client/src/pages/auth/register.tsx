import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "@/store/store";
import { registerUser } from "@/store/auth-slice";
import Form from "@/components/common/form";
import { registerFormControls } from "@/config";
import LoadingPage from "@/components/common/loading-page";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error, isAuthenticated } = useAuth(); // Sử dụng hook sẵn có
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Nếu auto login xong → redirect theo role
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === "admin" ? "/admin/dashboard" : "/";
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (values: Record<string, string>) => {
    setFormErrors({});
    const { confirmPassword, ...submitData } = values;
    const res = await dispatch(
      registerUser(
        submitData as { name: string; email: string; password: string }
      )
    );

    if (registerUser.rejected.match(res)) {
      const payload = res.payload as any;
      setFormErrors(payload?.fieldErrors || {});
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-4 text-center">Đăng ký</h1>

      <Form
        controls={registerFormControls}
        onSubmit={handleSubmit}
        submitText="Đăng ký"
        loading={loading}
        errors={formErrors}
      />

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      {/* Links */}
      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/auth/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
