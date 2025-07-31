import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface CheckAuthProps {
  isAuthenticated: boolean;
  user: any;
  children?: ReactNode;
}

function getRedirectPath(
  pathname: string,
  isAuthenticated: boolean,
  user: any
): string | null {
  const isLoginPage = pathname.includes("/auth/login");
  const isRegisterPage = pathname.includes("/auth/register");
  const isAuthPage = isLoginPage || isRegisterPage;
  const isAdminRoute = pathname.startsWith("/admin");

  // Homepage (/) and all public routes: never redirect here
  if (pathname === "/") return null;

  // If not logged in and trying to access admin -> force login
  if (!isAuthenticated && isAdminRoute) {
    return "/auth/login";
  }

  // If logged in and accessing login/register -> redirect away
  if (isAuthenticated && isAuthPage) {
    return user?.role === "admin" ? "/admin/dashboard" : "/";
  }

  // If logged in but user (not admin) tries to access admin -> block
  if (isAuthenticated && user?.role !== "admin" && isAdminRoute) {
    return "/unauth-page";
  }

  return null; // otherwise, allow
}

function CheckAuth({ isAuthenticated, user, children }: CheckAuthProps) {
  const location = useLocation();
  const redirectPath = getRedirectPath(
    location.pathname,
    isAuthenticated,
    user
  );

  if (redirectPath) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : null;
}

export default CheckAuth;
