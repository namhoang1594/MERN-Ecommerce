import express from "express";
import { verifyToken } from "../../middlewares/auth/auth";
import { getMyOrderById, getMyOrders } from "../../controllers/shop/order-controller";

const router = express.Router();

router.use(verifyToken);

// User
router.get("/", getMyOrders);
router.get("/:id", getMyOrderById);

export default router;
