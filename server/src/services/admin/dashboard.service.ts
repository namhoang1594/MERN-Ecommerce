import { Types } from "mongoose";
import Order from "../../models/orders.model";
import User from "../../models/user.model";
import Product from "../../models/products.model";
import { IOrder, OrderStatus } from "../../types/orders.types";

interface IOrderWithUserName extends Omit<IOrder, "userId"> {
    _id: Types.ObjectId; // ← cần bổ sung nếu dùng từ dữ liệu mongoose
    userId: {
        _id: Types.ObjectId;
        userName: string;
    };
}

export const getDashboardStatsService = async () => {
    // Tổng số đơn, doanh thu
    const [orders, users, products] = await Promise.all([
        Order.find().lean(),
        User.countDocuments(),
        Product.countDocuments(),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const totalUsers = users;
    const totalProducts = products;

    // Biểu đồ doanh thu theo tháng
    const monthlyMap = new Map<string, number>();
    for (const order of orders) {
        const date = new Date(order.orderDate);
        const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthlyMap.set(month, (monthlyMap.get(month) || 0) + order.totalAmount);
    }
    const monthlyRevenue = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({
        month,
        revenue,
    }));

    // Trạng thái đơn hàng
    const orderStatusStats = Object.values(OrderStatus).map((status) => {
        const count = orders.filter((o) => o.orderStatus === status).length;
        return {
            status,
            count,
            name: status,
            value: count,
        };
    });

    // Top 5 sản phẩm bán chạy
    const topProductsAgg = await Order.aggregate([
        { $unwind: "$cartItems" },
        {
            $group: {
                _id: "$cartItems.productId",
                totalSold: { $sum: "$cartItems.quantity" },
            },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
            $addFields: {
                productObjectId: { $toObjectId: "$_id" },
            },
        },
        {
            $lookup: {
                from: "products",
                localField: "productObjectId",
                foreignField: "_id",
                as: "productInfo",
            },
        },
        { $unwind: "$productInfo" },
        {
            $project: {
                title: "$productInfo.title",
                image: "$productInfo.image",
                totalSold: 1,
            },
        },
    ]);


    const topProducts = topProductsAgg.map((p) => ({
        title: p.title,
        image: p.image,
        totalSold: p.totalSold,
    }));

    // Đơn hàng gần đây
    const recentOrdersAgg = await Order.find()
        .sort({ orderDate: -1 })
        .limit(5)
        .populate("userId", "userName")
        .lean();

    const typedOrders = recentOrdersAgg as unknown as IOrderWithUserName[];

    const recentOrders = typedOrders
        .filter(order => order.userId)
        .map(order => ({
            _id: order._id,
            user: {
                name: order.userId.userName,
            },
            totalAmount: order.totalAmount,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            orderDate: order.orderDate,
        }));

    return {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        monthlyRevenue,
        orderStatusStats,
        topProducts,
        recentOrders,
    };
};
