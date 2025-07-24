import { Router } from "express";
import {
  getAllOrdersOfAllUser,
  getOrderDetailsAdmin,
  updateOrderStatus,
} from "../../controllers/admin/order-controller";

const router = Router();

router.get("/get", getAllOrdersOfAllUser);
router.get("/details/:id", getOrderDetailsAdmin);
router.put("/update-status/:id", updateOrderStatus);

export default router;
