import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Loader2, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  calculateTotals,
  getCartItems,
  getProductInfo,
} from "@/helpers/cart/product-info";
import { fetchCart } from "@/store/shop/cart-slice";

export default function CartDropdown() {
  const dispatch = useDispatch<AppDispatch>();
  const { serverCart, localCart, isLoggedIn, loading, hasFetchedServerCart } =
    useSelector((state: RootState) => state.shopCart);

  useEffect(() => {
    // Nếu đã login nhưng chưa có server cart data và chưa đang fetch
    if (isLoggedIn && !serverCart && !hasFetchedServerCart && !loading.fetch) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn, serverCart, hasFetchedServerCart, loading.fetch, dispatch]);

  const items = getCartItems(isLoggedIn, serverCart, localCart);
  const { totalPrice, totalItems } = calculateTotals(items, isLoggedIn);

  // const handleRemoveItem = (productId: string) => {
  //   if (isLoggedIn) {
  //     dispatch(removeFromCart(productId));
  //   } else {
  //     dispatch(removeFromLocalCart(productId));
  //   }
  // };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Giỏ hàng</h3>
          {loading.fetch && <Loader2 className="w-4 h-4 animate-spin" />}
        </div>

        {isLoggedIn && !serverCart && loading.fetch ? (
          <div className="text-center py-4">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Đang tải giỏ hàng...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-4">
            <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Giỏ hàng trống</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.slice(0, 5).map((item: any, index: number) => {
                const productInfo = getProductInfo(item, isLoggedIn);
                if (!productInfo) return null;

                return (
                  <div
                    key={`${productInfo.id}-${index}`}
                    className="flex items-center gap-3 py-2"
                  >
                    <img
                      src={productInfo.image || "/placeholder.png"}
                      alt={productInfo.title}
                      className="w-12 h-12 rounded object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {productInfo.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Số lượng: {item.quantity}
                        </span>
                        <span className="text-sm font-medium">
                          {productInfo.displayPrice.toLocaleString()}đ
                        </span>
                      </div>
                    </div>

                    {/* <Button
                      size="sm"
                      variant="ghost"
                      disabled={isItemLoading}
                      onClick={() => handleRemoveItem(productInfo.id)}
                      className="p-1 h-auto"
                    >
                      {isItemLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                    </Button> */}
                  </div>
                );
              })}

              {items.length > 5 && (
                <p className="text-xs text-center text-gray-500 py-2">
                  và {items.length - 5} sản phẩm khác...
                </p>
              )}
            </div>

            <div className="border-t mt-3 pt-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Tổng cộng:</span>
                <span className="font-bold text-red-600">
                  {totalPrice.toLocaleString()}đ
                </span>
              </div>

              <Link to="/cart">
                <Button className="w-full">Xem giỏ hàng</Button>
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
