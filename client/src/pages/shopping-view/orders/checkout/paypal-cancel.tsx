import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";

export default function PaypalCancelPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      setMessage("Không tìm thấy mã đơn hàng để hủy");
      setLoading(false);
      return;
    }

    const cancelPayment = async () => {
      try {
        const res = await axiosInstance.get(
          `/shop/checkout/paypal/cancel?orderId=${orderId}`
        );
        setMessage("Thanh toán đã bị hủy. Mã đơn: " + res.data.order._id);
      } catch (err: any) {
        setMessage(err.response?.data?.message || "Hủy thanh toán thất bại");
      } finally {
        setLoading(false);
      }
    };

    cancelPayment();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p>Đang xử lý hủy thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Thanh toán bị hủy</h1>
      <p>{message}</p>
      <button
        onClick={() => navigate("/cart")}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Quay lại giỏ hàng
      </button>
    </div>
  );
}
