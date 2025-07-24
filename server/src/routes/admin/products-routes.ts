import { Router } from "express";
import {
  handleImageUpload,
  addProduct,
  fetchAllProduct,
  editProduct,
  deleteProduct
} from "../../controllers/admin/products-controller";
import { upload } from "../../helpers/cloudinary";

const router = Router();


router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.get("/get", fetchAllProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
