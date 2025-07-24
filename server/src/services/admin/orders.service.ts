import Order from "../../models/orders.model";

export const findAllOrders = () => {
    return Order.find();
};

export const findOrderById = (id: string) => {
    return Order.findById(id);
};

export const updateOrderStatusById = (
    id: string,
    orderStatus: string) => {
    return Order.findByIdAndUpdate(id, {
        orderStatus
    });
};
