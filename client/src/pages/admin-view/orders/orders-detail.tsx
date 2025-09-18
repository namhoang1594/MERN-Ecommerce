import { useEffect } from "react";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderDetailAdmin,
  resetAdminOrderDetail,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { Button } from "@/components/ui/button";
import {
  getOrderStatusColor,
  getOrderStatusLabel,
  OrderStatus,
} from "@/helpers/cart/color-status-change";

interface AdminOrderDetailModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminOrderDetailModal({
  orderId,
  isOpen,
  onClose,
}: AdminOrderDetailModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { detail, loading, error } = useSelector(
    (state: RootState) => state.adminOrder
  );

  useEffect(() => {
    if (isOpen && orderId) {
      if (!detail || detail._id !== orderId) {
        dispatch(fetchOrderDetailAdmin(orderId));
      }
    }
  }, [isOpen, orderId, dispatch]);

  useEffect(() => {
    return () => {
      if (!isOpen) {
        dispatch(resetAdminOrderDetail());
      }
    };
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const handleStatusChange = (status: string) => {
    if (!orderId) return;
    if (
      confirm(`Xác nhận đổi trạng thái thành "${getOrderStatusLabel(status)}"?`)
    ) {
      dispatch(updateOrderStatus({ id: orderId, status }));
    }
  };

  const handleClose = () => {
    dispatch(resetAdminOrderDetail());
    onClose();
  };

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
        <Button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </Button>

        {/* {loading && <p>Đang tải...</p>} */}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && detail && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h1>

            {/* Basic Info */}
            <div>
              <p>
                <strong>Mã đơn:</strong> #{detail._id.slice(-6)}
              </p>
              <p>
                <strong>Khách hàng:</strong> {detail.userId?.name}
              </p>
              <p>
                <strong>Email:</strong> {detail.userId?.email}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${getOrderStatusColor(
                    detail.status
                  )}`}
                >
                  {getOrderStatusLabel(detail.status)}
                </span>
              </p>
            </div>

            {/* Status Buttons */}
            <div className="flex flex-wrap gap-2">
              {Object.values(OrderStatus).map((status) => (
                <Button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={loading}
                  className={`px-3 py-1 rounded text-white text-sm transition-all ${getOrderStatusColor(
                    status
                  )} ${
                    detail.status === status
                      ? "ring-2 ring-offset-2 ring-blue-500"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {getOrderStatusLabel(status)}
                </Button>
              ))}
            </div>

            {/* Shipping Info */}
            <div>
              <h2 className="font-semibold">Thông tin giao hàng</h2>
              <p>
                {detail.shippingInfo.fullName} - {detail.shippingInfo.phone}
                <br />
                {detail.shippingInfo.street}, {detail.shippingInfo.ward},{" "}
                {detail.shippingInfo.province}
              </p>
            </div>

            {/* Items */}
            <div>
              <h2 className="font-semibold">Sản phẩm</h2>
              {detail.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    {(item.quantity * item.priceAtPurchase).toLocaleString()} đ
                  </span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <p>
              <strong>Tổng cộng:</strong> {detail.finalAmount.toLocaleString()}{" "}
              đ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
