import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return user?.role === "admin" ? (
    <>{children}</>
  ) : (
    <Navigate to="/unauth-page" replace />
  );
};

export default AdminRoute;
