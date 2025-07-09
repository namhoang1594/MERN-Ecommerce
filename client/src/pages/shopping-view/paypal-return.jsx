import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paypalOrderId = params.get("token");
  const mongoOrderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

  useEffect(() => {
    if (paypalOrderId && mongoOrderId) {
      dispatch(
        capturePayment({
          paypalOrderId,
          mongoOrderId,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paypalOrderId, mongoOrderId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment.....Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
