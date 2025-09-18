import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { calculateTotals, getCartItems } from "@/helpers/cart/product-info";

export default function CheckoutSummary() {
  const { isLoggedIn, serverCart, localCart } = useSelector(
    (state: RootState) => state.shopCart
  );

  const items = getCartItems(isLoggedIn, serverCart, localCart);
  const { totalPrice } = calculateTotals(items, isLoggedIn);

  const shippingFee = totalPrice > 500000 ? 0 : 30000;
  const finalAmount = totalPrice + shippingFee;

  return (
    <div className="border rounded-lg p-4 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold">Đơn hàng của bạn</h2>

      <div className="space-y-2 text-sm">
        {items.map((item: any) => {
          const productName =
            item.productId.title || item.productId.name || "Sản phẩm";
          const price = item.productId.salePrice ?? item.productId.price ?? 0;
          return (
            <div
              key={item._id || item.item.productId._id}
              className="flex justify-between"
            >
              <span>
                {productName} x {item.quantity}
              </span>
              <span>{(item.quantity * price).toLocaleString()} đ</span>
            </div>
          );
        })}
      </div>

      <hr />
      <div className="flex justify-between text-sm">
        <span>Tạm tính</span>
        <span>{totalPrice.toLocaleString()} đ</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Phí vận chuyển</span>
        <span>{shippingFee.toLocaleString()} đ</span>
      </div>
      <div className="flex justify-between font-semibold">
        <span>Tổng cộng</span>
        <span>{finalAmount.toLocaleString()} đ</span>
      </div>
    </div>
  );
}
