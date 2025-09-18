import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { fetchOrderDetail, resetOrderDetail } from "@/store/shop/order-slice";
import {
  getOrderStatusColor,
  getOrderStatusLabel,
} from "@/helpers/cart/color-status-change";
import { Button } from "@/components/ui/button";

interface OrderDetailPageProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailModal({
  orderId,
  isOpen,
  onClose,
}: OrderDetailPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { detail, loading, error } = useSelector(
    (state: RootState) => state.shopOrder
  );

  useEffect(() => {
    if (isOpen && orderId) {
      if (!detail || detail._id !== orderId) {
        dispatch(fetchOrderDetail(orderId));
      }
    }
  }, [isOpen, orderId, dispatch]);

  useEffect(() => {
    return () => {
      if (!isOpen) {
        dispatch(resetOrderDetail());
      }
    };
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(resetOrderDetail());
    onClose();
  };

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Close button */}
        <Button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          ✕
        </Button>

        {loading && <p>Đang tải...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && detail && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>

            {/* Order Info */}
            <div className="border rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold mb-4">Thông tin đơn hàng</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Mã đơn:</strong> #{detail._id.slice(-6)}
                </p>
                <p>
                  <strong>Trạng thái:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs ${getOrderStatusColor(
                      detail.status
                    )}`}
                  >
                    {getOrderStatusLabel(detail.status)}
                  </span>
                </p>
                <p>
                  <strong>Phương thức thanh toán:</strong>{" "}
                  {detail.paymentMethod}
                </p>
                <p>
                  <strong>Ngày đặt:</strong>{" "}
                  {new Date(detail.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold mb-4">Thông tin giao hàng</h2>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Người nhận:</strong> {detail.shippingInfo.fullName}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {detail.shippingInfo.phone}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {detail.shippingInfo.street},{" "}
                  {detail.shippingInfo.ward}, {detail.shippingInfo.province}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="border rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold mb-4">Sản phẩm</h2>
              <div className="space-y-3">
                {detail.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="flex items-center space-x-3">
                      {item.thumbnail && (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.variant && (
                          <p className="text-sm text-gray-500">
                            Phân loại: {item.variant}
                          </p>
                        )}
                        <p className="text-sm">Số lượng: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.subtotal.toLocaleString()} đ
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.priceAtPurchase.toLocaleString()} đ/sp
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold mb-4">Thanh toán</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{detail.totalAmount.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{detail.shippingFee.toLocaleString()} đ</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">
                    {detail.finalAmount.toLocaleString()} đ
                  </span>
                </div>
              </div>

              {/* Payment Status */}
              {detail.paymentResult &&
                detail.paymentResult.status === "COMPLETED" && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800 text-sm">
                      ✓ Đã thanh toán qua{" "}
                      {detail.paymentResult.provider?.toUpperCase()}
                    </p>
                    {detail.paymentResult.paidAt && (
                      <p className="text-green-600 text-xs mt-1">
                        Thời gian:{" "}
                        {new Date(detail.paymentResult.paidAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
