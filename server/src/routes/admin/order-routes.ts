import express from "express";
import { requireAdmin, verifyToken } from "../../middlewares/auth/auth";
import { getAllOrders, getOrderById, updateOrderStatus } from "../../controllers/admin/order-controller";

const router = express.Router();

router.use(verifyToken, requireAdmin);

router.get("/", getAllOrders);
router.get('/:id', getOrderById);
router.put("/:id/status", updateOrderStatus);

export default router;
