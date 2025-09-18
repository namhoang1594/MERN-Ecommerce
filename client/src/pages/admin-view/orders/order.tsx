import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAllOrders } from "@/store/admin/order-slice";
import { Link } from "react-router-dom";
import {
  getOrderStatusColor,
  getOrderStatusLabel,
} from "@/helpers/cart/color-status-change";
import AdminOrderDetailModal from "./orders-detail";

export default function AdminOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.adminOrder
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const filteredOrders = list.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;

    if (dateFilter !== "all") {
      const orderDate = new Date(order.createdAt);
      const today = new Date();

      switch (dateFilter) {
        case "today":
          return orderDate.toDateString() === today.toDateString();
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case "month":
          return (
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear()
          );
      }
    }

    return true;
  });

  console.log("Render page, selectedOrderId:", selectedOrderId);

  // if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
        <div className="flex gap-4">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">Tất cả trạng thái</option>
            {list.length > 0 &&
              [...new Set(list.map((o) => o.status))].map((status) => (
                <option key={status} value={status}>
                  {getOrderStatusLabel(status)}
                </option>
              ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">Tháng này</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-semibold text-blue-800">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold text-blue-900">{list.length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-semibold text-yellow-800">Chờ xử lý</h3>
          <p className="text-2xl font-bold text-yellow-900">
            {list.filter((o) => o.status === "pending").length}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-semibold text-green-800">Đã giao</h3>
          <p className="text-2xl font-bold text-green-900">
            {list.filter((o) => o.status === "delivered").length}
          </p>
        </div>
        <div className="bg-purple-100 p-4 rounded">
          <h3 className="font-semibold text-purple-800">Tổng doanh thu</h3>
          <p className="text-2xl font-bold text-purple-900">
            {list
              .filter((o) => o.status === "delivered")
              .reduce((sum, o) => sum + (o.finalAmount ?? 0), 0)
              .toLocaleString("vi-VN")}{" "}
            đ
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 border text-left font-semibold">Mã đơn</th>
              <th className="p-3 border text-left font-semibold">Khách hàng</th>
              <th className="p-3 border text-left font-semibold">Trạng thái</th>
              <th className="p-3 border text-right font-semibold">Tổng tiền</th>
              <th className="p-3 border text-left font-semibold">Ngày tạo</th>
              <th className="p-3 border text-center font-semibold">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr
                key={order._id}
                className={`border-t hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-25"
                }`}
              >
                <td className="p-3 border font-mono text-sm">
                  #{order._id.slice(-6)}
                </td>
                <td className="p-3 border">
                  <div>
                    <p className="font-medium">{order.userId?.name}</p>
                    <p className="text-xs text-gray-500">
                      {order.userId?.email}
                    </p>
                  </div>
                </td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {getOrderStatusLabel(order.status)}
                  </span>
                </td>
                <td className="p-3 border text-right font-semibold text-red-600">
                  {order.finalAmount != null
                    ? order.finalAmount.toLocaleString("vi-VN") + " ₫"
                    : "Chưa có"}
                </td>
                <td className="p-3 border text-sm">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  <br />
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString("vi-VN")}
                  </span>
                </td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => setSelectedOrderId(order._id)}
                    className="inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
        </div>
      )}

      {/* Detail Modal */}
      <AdminOrderDetailModal
        orderId={selectedOrderId}
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}
