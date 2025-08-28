import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
