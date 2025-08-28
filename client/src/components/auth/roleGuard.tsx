import { useSelector } from "react-redux";
import { ReactNode, useEffect } from "react";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      navigate("/"); // hoặc trang 403
    }
  }, [user, allowedRoles, navigate]);

  if (!user) return null; // chưa login thì ProtectedRoute xử lý

  return <>{children}</>;
}
