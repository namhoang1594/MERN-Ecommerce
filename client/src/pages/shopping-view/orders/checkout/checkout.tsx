import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  clearRedirectUrl,
  createOrder,
} from "@/store/shop/order-slice/checkout-slice";
import CheckoutForm from "./checkout-form";
import CheckoutSummary from "./checkout-summary";
import {
  getCartItems,
  resetCartAfterCheckout,
} from "@/helpers/cart/product-info";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "@/store/shop/user-profile-slice";

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, redirectUrl, orderId } = useSelector(
    (state: RootState) => state.shopCheckout
  );
  const { isLoggedIn, serverCart, localCart } = useSelector(
    (state: RootState) => state.shopCart
  );

  const items = getCartItems(isLoggedIn, serverCart, localCart);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchProfile());
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (!items.length) {
      // Redirect to cart page or show empty state
      navigate("/cart");
    }
  }, [items.length, navigate]);

  useEffect(() => {
    if (redirectUrl) {
      // Clear redirect URL trước khi redirect để tránh loop
      dispatch(clearRedirectUrl());
      window.location.href = redirectUrl;
    }
  }, [redirectUrl, dispatch]);

  // FIX: Navigate to success page sau khi có orderId (cho non-PayPal payments)
  useEffect(() => {
    if (orderId && !redirectUrl) {
      // Delay một chút để user thấy success message
      resetCartAfterCheckout(dispatch);

      const timer = setTimeout(() => {
        navigate(`/orders`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [orderId, redirectUrl, navigate]);

  if (!items.length) {
    return (
      <div className="text-center py-8">
        <p>Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.</p>
      </div>
    );
  }

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  const handleSubmit = (formData: any) => {
    if (!items.length) return;

    const payload = {
      ...formData,
      items: items.map((item: any) => {
        const product = item.product || item.productId || item;
        const unitPrice = product.salePrice ?? product.price ?? item.price ?? 0;
        return {
          productId: product._id || item._id,
          name: product.name || product.title, // fix lệch title <-> name
          quantity: item.quantity,
          priceAtPurchase: unitPrice,
          variant: item.variant || null,
          subtotal: unitPrice * item.quantity,
        };
      }),
    };

    dispatch(createOrder(payload));
  };

  return (
    <div className="container mx-auto py-6">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded">
            <p>Đang xử lý đơn hàng...</p>
          </div>
        </div>
      )}
      <div className={`${loading ? "opacity-50 pointer-events-none" : ""}`}>
        <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form nhập shipping + payment */}
          <div className="md:col-span-2">
            <CheckoutForm onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Tóm tắt giỏ hàng */}
          <div>
            <CheckoutSummary />
          </div>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {orderId && !redirectUrl && (
          <p className="text-green-600 mt-4">
            Đặt hàng thành công! Mã đơn: {orderId}
          </p>
        )}
      </div>
    </div>
  );
}
