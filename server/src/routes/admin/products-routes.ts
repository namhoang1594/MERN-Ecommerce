import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getFlashSaleForShop,
  getNewArrivalProducts,
  getProductById,
  getProducts,
  getProductsForShop,
  getSuggestionProducts,
  toggleFlashSaleStatusController,
  toggleProductStatusController,
  updateProduct
} from "../../controllers/admin/products-controller";


const router = Router();

router.post("/create", createProduct);
router.get("/", getProducts);
router.get("/flash-sale", getFlashSaleForShop);
router.get("/suggestions", getSuggestionProducts);
router.get("/new-arrivals", getNewArrivalProducts);
router.get("/grid-allProduct", getProductsForShop);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.post("/:id/delete", deleteProduct);
router.put("/:id/toggle", toggleProductStatusController);
router.put("/:id/toggleFlashSale", toggleFlashSaleStatusController);


export default router;
