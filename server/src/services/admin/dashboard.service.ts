import { Types } from "mongoose";
import Order from "../../models/orders.model";
import User from "../../models/user.model";
import Product from "../../models/products.model";
import { IOrder, OrderStatus } from "../../types/orders.types";

interface IOrderWithUserName extends Omit<IOrder, "userId"> {
    _id: Types.ObjectId;
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
        const date = new Date(order.createdAt);
        const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthlyMap.set(month, (monthlyMap.get(month) || 0) + order.totalAmount);
    }
    const monthlyRevenue = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({
        month,
        revenue,
    }));

    // Trạng thái đơn hàng
    const orderStatusStats = Object.values(OrderStatus).map((status) => {
        const count = orders.filter((o) => o.status === status).length;
        return {
            status,
            count,
            name: status,
            value: count,
        };
    });

    // Top 5 sản phẩm bán chạy
    const topProductsAgg = await Order.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.productId",
                totalSold: { $sum: "$items.quantity" },
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
                localField: "_id",
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
        image: {
            url: p.image.url,
            public_id: p.image.public_id
        },
        totalSold: p.totalSold,
    }));

    // Đơn hàng gần đây
    const recentOrdersAgg = await Order.find()
        .sort({ orderDate: -1 })
        .limit(5)
        .populate("userId", "name email")
        .lean();

    const typedOrders = recentOrdersAgg as unknown as IOrderWithUserName[];

    const recentOrders = typedOrders
        .filter(order => order.userId)
        .map(order => ({
            _id: order._id,
            user: {
                name: (order.userId as any).name,
                email: (order.userId as any).email,
            },
            finalAmount: order.finalAmount,
            paymentStatus: order.paymentResult?.status || "unpaid",
            orderStatus: order.status,
            createdAt: order.createdAt,
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
