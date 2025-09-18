import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { confirmPaypalPayment } from "@/store/shop/order-slice/checkout-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { resetCartAfterCheckout } from "@/helpers/cart/product-info";

export default function PaypalSuccessPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const orderId = searchParams.get("orderId");

    if (!token || !orderId) {
      setMessage("Thiếu thông tin thanh toán");
      setLoading(false);
      return;
    }

    const confirmPayment = async () => {
      try {
        // FIX: Sử dụng Redux action thay vì direct API call
        const result = await dispatch(confirmPaypalPayment({ token, orderId }));

        if (confirmPaypalPayment.fulfilled.match(result)) {
          setMessage(
            "Thanh toán thành công! Mã đơn: " + result.payload.order._id
          );
          setIsSuccess(true);
          resetCartAfterCheckout(dispatch);
        } else {
          setMessage(
            (result.payload as string) || "Xác nhận thanh toán thất bại"
          );
          setIsSuccess(false);
        }
      } catch (err: any) {
        setMessage("Xác nhận thanh toán thất bại");
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [dispatch, searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 text-center">
      <div
        className={`max-w-md mx-auto p-6 rounded-lg ${
          isSuccess ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <h1 className="text-2xl font-bold mb-4">
          {isSuccess ? "✅ Thanh toán thành công!" : "❌ Thanh toán thất bại"}
        </h1>
        <p className={`mb-6 ${isSuccess ? "text-green-700" : "text-red-700"}`}>
          {message}
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Xem đơn hàng của tôi
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="px-4 py-2"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
