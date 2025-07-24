import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
  getAllOrdersAdmin,
  getOrderDetailsAdmin,
  updateOrderStatus,
} from "../../store/admin/order-slice";
import { toast } from "sonner";
import { RootState, AppDispatch } from "../../store/store";
import { OrderDetails } from "../../store/admin/order-slice/order.types";

interface OrderDetailsProps {
  orderDetails: OrderDetails;
}

interface FormData {
  status: string;
}

const initialFormData: FormData = {
  status: "",
};

function AdminOrderDetails({ orderDetails }: OrderDetailsProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  function handleUpdateStatus(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({
        id: orderDetails._id,
        orderStatus: status,
      })
    ).then((data) => {
      if (data?.payload) {
        dispatch(getOrderDetailsAdmin(orderDetails._id));
        dispatch(getAllOrdersAdmin());
        setFormData(initialFormData);
        toast.success("Câp nhật trạng thái đơn hàng thành công");
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between mt-6">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails._id}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails.orderStatus}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails.paymentMethod || "N/A"}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails.paymentStatus || "N/A"}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails.totalAmount}</Label>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails.cartItems?.length > 0
                ? orderDetails.cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{item.title}</span>
                      <span>x{item.quantity}</span>
                      <span>${item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName}</span>
              <span>{orderDetails.addressInfo.street}</span>
              <span>{orderDetails.addressInfo.city}</span>
              <span>{orderDetails.addressInfo.country}</span>
              <span>{orderDetails.addressInfo.postalCode}</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetails;
