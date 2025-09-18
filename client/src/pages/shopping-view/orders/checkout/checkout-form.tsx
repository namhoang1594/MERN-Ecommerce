import Form from "@/components/common/form";
import { checkoutFormControls } from "@/config";
import {
  PaymentMethod,
  ShippingInfo,
} from "@/store/shop/order-slice/checkout-slice/checkout.types";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface CheckoutFormProps {
  onSubmit: (values: {
    shippingInfo: {
      fullName: string;
      phone: string;
      street: string;
      ward: string;
      province: string;
    };
    paymentMethod: PaymentMethod;
    note?: string;
  }) => void;
  loading?: boolean;
}

export default function CheckoutForm({ onSubmit, loading }: CheckoutFormProps) {
  const { defaultAddress } = useSelector(
    (state: RootState) => state.shopUserProfile
  );

  const handleSubmit = (values: Record<string, string>) => {
    if (!defaultAddress) return;

    const { paymentMethod, note } = values;
    onSubmit({
      shippingInfo: {
        fullName: defaultAddress.fullName,
        phone: defaultAddress.phone,
        street: defaultAddress.street,
        ward: defaultAddress.ward,
        province: defaultAddress.province,
      },
      paymentMethod: paymentMethod as PaymentMethod,
      note,
    });
  };

  return (
    <div className="space-y-6">
      {/* Địa chỉ mặc định */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h2 className="font-semibold mb-2">Địa chỉ giao hàng</h2>
        {defaultAddress ? (
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Họ tên: </span>
              {defaultAddress.fullName}
            </p>
            <p>
              <span className="font-medium">Số điện thoại: </span>
              {defaultAddress.phone}
            </p>
            <p>
              <span className="font-medium">Địa chỉ: </span>
              {defaultAddress.street}, {defaultAddress.ward},{" "}
              {defaultAddress.province}
            </p>
          </div>
        ) : (
          <p className="text-red-500">
            Bạn chưa có địa chỉ mặc định. Vui lòng thêm trong hồ sơ cá nhân.
          </p>
        )}
      </div>

      {/* Form chọn phương thức thanh toán + ghi chú */}
      <Form
        controls={checkoutFormControls}
        onSubmit={handleSubmit}
        submitText="Đặt hàng"
        loading={loading}
      />
    </div>
  );
}
