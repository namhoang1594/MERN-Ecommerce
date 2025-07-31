import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
