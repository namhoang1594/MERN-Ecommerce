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
// GET list + search + pagination
router.get("/", getAllCategory);

// GET by ID
router.get("/:id", getCategoryById);

// POST - create
router.post("/create", createCategory);

// PUT - update
router.put("/:id", upload.single("my_file"), updateCategory);

// DELETE
router.delete("/:id", deleteCategory);

export default router;
