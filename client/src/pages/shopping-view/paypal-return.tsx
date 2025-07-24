import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { AppDispatch } from "@/store/store";
import { CapturePaymentParams } from "@/store/shop/order-slice/order.types";

const PaypalReturnPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const paypalOrderId = params.get("token");

  const mongoOrderId = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("currentOrderId") || "null") as
        | string
        | null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (paypalOrderId && mongoOrderId) {
      const payload: CapturePaymentParams = {
        paypalOrderId,
        mongoOrderId,
      };

      dispatch(capturePayment(payload)).then((res) => {
        if (
          res.payload &&
          typeof res.payload === "object" &&
          "success" in res.payload &&
          res.payload.success
        ) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paypalOrderId, mongoOrderId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default PaypalReturnPage;
