import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/store/store";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchCart,
  removeFromCart,
  removeFromLocalCart,
  updateCartItem,
  updateLocalCartItem,
} from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import QuantitySelector from "@/components/shopping-view/quantity-selector";
import {
  calculateTotals,
  getCartItems,
  getProductInfo,
} from "@/helpers/cart/product-info";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    serverCart,
    localCart,
    isLoggedIn,
    loading,
    error,
    itemOperations,
    hasFetchedServerCart,
  } = useSelector((state: RootState) => state.shopCart);

  const items = getCartItems(isLoggedIn, serverCart, localCart);
  const { totalPrice, totalItems } = calculateTotals(items, isLoggedIn);

  useEffect(() => {
    if (isLoggedIn && !hasFetchedServerCart && !loading.fetch) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn, hasFetchedServerCart, loading.fetch, dispatch]);

  // ✅ Handle quantity update
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (isLoggedIn) {
      dispatch(updateCartItem({ productId, quantity: newQuantity }));
    } else {
      dispatch(updateLocalCartItem({ productId, quantity: newQuantity }));
    }
  };

  // ✅ Handle remove item
  const handleRemoveItem = (productId: string) => {
    if (isLoggedIn) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(removeFromLocalCart(productId));
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/auth/login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  //Loading state

  if (isLoggedIn && loading.fetch && !hasFetchedServerCart) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center min-h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Đang tải giỏ hàng...</span>
      </div>
    );
  }

  //Empty state
  if (
    items.length === 0 &&
    (!isLoggedIn || (isLoggedIn && hasFetchedServerCart))
  ) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Giỏ hàng</h2>
        <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống.</p>
        <Link to="/">
          <Button>Tiếp tục mua sắm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/*Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            Giỏ hàng có ({totalItems} sản phẩm)
          </h2>

          <div className="space-y-4">
            {items.map((item: any, index: number) => {
              const productInfo = getProductInfo(item, isLoggedIn);
              if (!productInfo) return null;
              const isItemUpdating =
                itemOperations[productInfo.id] === "updating";
              const isItemRemoving =
                itemOperations[productInfo.id] === "removing";
              return (
                <div
                  key={`${productInfo.id}-${index}`}
                  className="flex items-center gap-4 border rounded-lg p-4"
                >
                  <img
                    src={productInfo.image || "/placeholder.png"}
                    alt={productInfo.title}
                    className="w-20 h-20 rounded object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{productInfo.title}</h3>

                    <div className="flex items-center gap-2 mt-1">
                      {productInfo.salePrice ? (
                        <>
                          <span className="text-red-500 font-semibold text-lg">
                            {productInfo.salePrice.toLocaleString()}đ
                          </span>
                          <span className="text-gray-400 line-through text-sm">
                            {productInfo.price.toLocaleString()}đ
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-lg">
                          {productInfo.price.toLocaleString()}đ
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(newQuantity) =>
                          handleQuantityChange(productInfo.id, newQuantity)
                        }
                        min={1}
                        max={productInfo.totalStock}
                        disabled={isItemUpdating}
                      />

                      {/* {isItemUpdating && (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      )} */}

                      <span className="text-sm text-gray-500">
                        Còn {productInfo.totalStock} sản phẩm
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {(
                        item.quantity * productInfo.displayPrice
                      ).toLocaleString()}
                      đ
                    </p>

                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isItemRemoving}
                      onClick={() => handleRemoveItem(productInfo.id)}
                      className="mt-2"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      Xóa
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/*Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Số lượng sản phẩm:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{totalPrice.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-red-600">
                  {totalPrice.toLocaleString()}đ
                </span>
              </div>
            </div>

            <Button
              className="w-full mt-4"
              size="lg"
              disabled={items.length === 0 || loading.update}
              onClick={handleCheckout}
            >
              {loading.merge && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Thanh toán
            </Button>

            <Link to="/products">
              <Button variant="outline" className="w-full mt-2">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
