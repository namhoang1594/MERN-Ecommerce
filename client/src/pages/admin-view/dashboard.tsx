import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp, ShoppingCart, Users, DollarSign } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { getDashboardStats } from "@/services/admin/dashboard";
import { DashboardStatsResponse } from "@/store/admin/dashboard-slice/dashboard.types";

const pieColors = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

const DashboardPage = () => {
  const [dashboardData, setDashboardData] =
    useState<DashboardStatsResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDashboardStats();
      setDashboardData(data);
    };
    fetchData();
  }, []);

  if (!dashboardData) return <p className="p-6">Đang tải dữ liệu...</p>;

  const {
    totalRevenue,
    totalOrders,
    totalUsers,
    totalProducts,
    monthlyRevenue,
    orderStatusStats,
    topProducts,
    recentOrders,
  } = dashboardData;

  const cards = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(totalRevenue),
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Sản phẩm đã bán",
      value: totalProducts,
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Tổng đơn hàng",
      value: totalOrders,
      icon: <ShoppingCart className="w-6 h-6 text-purple-500" />,
    },
    {
      title: "Người dùng",
      value: totalUsers,
      icon: <Users className="w-6 h-6 text-orange-500" />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Bảng điều khiển</h1>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={index} className="shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-xl font-semibold">{card.value}</p>
              </div>
              {card.icon}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              📈 Doanh thu theo tháng
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="revenue" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              📦 Trạng thái đơn hàng
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {orderStatusStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 bán chạy */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            🔥 Top 5 sản phẩm bán chạy
          </h2>
          <ul className="divide-y">
            {topProducts.map((product) => (
              <li key={product._id} className="flex items-center py-3">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-14 h-14 object-cover rounded-lg border mr-4"
                />
                <div className="flex-1">
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.totalSold} sản phẩm đã bán
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {product.totalSold}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">🕒 Đơn hàng gần đây</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 border">Khách hàng</th>
                  <th className="px-4 py-2 border">Tổng tiền</th>
                  <th className="px-4 py-2 border">Trạng thái</th>
                  <th className="px-4 py-2 border">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-2 border">{order.user.name}</td>
                    <td className="px-4 py-2 border">
                      {formatCurrency(
                        order.finalAmount ?? order.totalAmount ?? 0
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      <Badge
                        className={
                          order.orderStatus === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {order.orderStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
