import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  toggleProductStatusController,
  updateProduct
} from "../../controllers/admin/products-controller";


const router = Router();

router.post("/create", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.post("/:id/delete", deleteProduct);
router.put("/:id/toggle", toggleProductStatusController);

export default router;
