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
  const isLoginOrRegister =
    pathname.includes("/login") || pathname.includes("/register");
  const isAdminRoute = pathname.includes("admin");
  const isShopRoute = pathname.includes("shop");

  if (pathname === "/") {
    if (!isAuthenticated) {
      return "/auth/login";
    }
    return user?.role === "admin" ? "/admin/dashboard" : "/shop/home";
  }

  if (!isAuthenticated && !isLoginOrRegister) {
    return "/auth/login";
  }

  if (isAuthenticated && isLoginOrRegister) {
    return user?.role === "admin" ? "/admin/dashboard" : "/shop/home";
  }

  if (isAuthenticated && user?.role !== "admin" && isAdminRoute) {
    return "/unauth-page";
  }
  if (isAuthenticated && user?.role === "admin" && isShopRoute) {
    return "/admin/dashboard";
  }
  return null;
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
