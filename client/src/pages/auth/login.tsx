import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Form from "@/components/common/form";
import { loginFormControls } from "@/config";
import LoadingPage from "@/components/common/loading-page";
import { useAuth } from "@/hooks/useAuth";
import { loginUser } from "@/store/auth-slice";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const { user, loading, error, isAuthenticated } = useAuth();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Redirect nếu đã login
  useEffect(() => {
    if (isAuthenticated && user) {
      if (from && user.role === "customer") {
        // Customer được redirect về trang họ muốn truy cập
        navigate(from, { replace: true });
      } else if (user.role === "admin") {
        // Admin về dashboard (hoặc có thể respect from nếu là admin route)
        navigate("/admin/dashboard", { replace: true });
      } else {
        // Default fallback
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, from, navigate]);

  const handleSubmit = async (values: Record<string, any>) => {
    const res = await dispatch(
      loginUser(values as { email: string; password: string })
    );
    if (loginUser.rejected.match(res)) {
      const payload = res.payload as any;
      setFormErrors(payload?.fieldErrors || {});
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-4 text-center">Đăng nhập</h1>

      <Form
        controls={loginFormControls}
        onSubmit={handleSubmit}
        submitText="Đăng nhập"
        loading={loading}
        errors={formErrors}
      />

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      {/* Links */}
      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/auth/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
        <p className="text-sm">
          <Link
            to="/auth/forgot-password"
            className="text-indigo-600 font-medium hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </p>
      </div>
    </div>
  );
}
