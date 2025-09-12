import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/auth-slice";
import {
  clearLocalCart,
  fetchCart,
  mergeCart,
  setLoggedIn,
} from "@/store/shop/cart-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle2, LogOutIcon, LogInIcon, Loader2 } from "lucide-react";
import CartDropdown from "./cart-dropdown";
import { toast } from "sonner";

export default function ShopHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    localCart,
    isLoggedIn: cartIsLoggedIn,
    loading,
  } = useSelector((state: RootState) => state.shopCart);
  //Single source of truth for auth state
  const isLoggedIn = !!user;

  // Sync cart when login status changes
  useEffect(() => {
    if (cartIsLoggedIn !== isLoggedIn) {
      dispatch(setLoggedIn(isLoggedIn));

      if (isLoggedIn && !!user) {
        // User just logged in
        if (localCart.length > 0) {
          // Merge local cart with server
          dispatch(mergeCart(localCart))
            .unwrap()
            .then(() => {
              toast.success(
                `Đã đồng bộ ${localCart.length} sản phẩm từ giỏ hàng cục bộ`
              );
            })
            .catch(() => {
              toast.error("Không thể đồng bộ giỏ hàng");
            });
        } else {
          // Just fetch server cart
          dispatch(fetchCart()).catch(() =>
            toast.error("Không thể tải giỏ hàng từ server")
          );
        }
      } else if (!isLoggedIn) {
        // User logged out - clear local cart
        dispatch(clearLocalCart());
      }
    }
  }, [isLoggedIn, cartIsLoggedIn, localCart.length, dispatch]);

  //Handle login button click
  const handleLogin = useCallback(() => {
    navigate("/auth/login");
  }, [navigate]);

  //Handle logout with proper cleanup
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(setLoggedIn(false));
      navigate("/auth/login");
      toast.success("Đã đăng xuất thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 md:px-10 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-primary">
        🛒 E-Shop
      </Link>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Cart with sync indicator */}
        <div className="relative">
          <CartDropdown />
          {loading.fetch && (
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
              <Loader2 className="w-3 h-3 animate-spin" />
            </div>
          )}
        </div>

        {/* Auth */}
        {!isLoggedIn ? (
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
                  {user?.name || "Tài khoản"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Thông tin cá nhân</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/orders">Đơn hàng đã mua</Link>
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
