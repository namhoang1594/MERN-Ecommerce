import express from "express";
import { verifyToken } from "../../middlewares/auth/auth";
import { createOrder, paypalCancel, paypalSuccess } from "../../controllers/shop/checkout-controller";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/paypal/success", paypalSuccess);
router.get("/paypal/cancel", paypalCancel);
export default router;
