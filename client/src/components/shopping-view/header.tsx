import { ShoppingCart, UserCircle2, LogOutIcon, LogInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/auth-slice";
import { useAuth } from "@/hooks/useAuth";

export default function ShopHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Mock trạng thái login
  const cartCount = 3; // Mock số lượng trong giỏ

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 md:px-10 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-primary">
        🛒 E-Shop
      </Link>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Cart */}
        <Link to="/cart" className="relative">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Auth */}
        {!isAuthenticated ? (
          <Button variant="outline" size="sm" onClick={handleLogin}>
            <LogInIcon className="w-4 h-4 mr-1" />
            Đăng nhập
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <UserCircle2 className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {" "}
                  {user?.name || "Tài khoản"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/orders">Đơn mua</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon className="w-4 h-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
