import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getCategoryById,
    updateCategory
} from "../../controllers/admin/category-controller";
import { upload } from "../../helpers/cloudinary";


const router = Router();
router.get("/", getAllCategory);
router.post("/create", createCategory);
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("my_file"), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
