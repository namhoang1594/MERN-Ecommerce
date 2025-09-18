import {
  getOrderStatusColor,
  getOrderStatusLabel,
} from "@/helpers/cart/color-status-change";
import { fetchOrders } from "@/store/shop/order-slice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderDetailModal from "./orders-detail";

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.shopOrder
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>
      {list.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {list.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Mã đơn: #{order._id.slice(-6)}</p>
                <p>
                  Trạng thái:{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {getOrderStatusLabel(order.status)}
                  </span>
                </p>
                <p>Ngày đặt: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">
                  {order.finalAmount.toLocaleString()} đ
                </p>
                <button
                  onClick={() => setSelectedOrderId(order._id)}
                  className="text-blue-600 underline text-sm"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal chi tiết */}
      <OrderDetailModal
        orderId={selectedOrderId}
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}
