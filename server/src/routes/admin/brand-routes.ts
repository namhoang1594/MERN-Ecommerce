import { Router } from "express";
import {
    createBrand,
    deleteBrand,
    getAllBrands,
    getBrandById,
    updateBrand
} from "../../controllers/admin/brand-controller";
import { upload } from "../../helpers/cloudinary";


const router = Router();
// GET list + search + pagination
router.get("/", getAllBrands);

// GET by ID
router.get("/:id", getBrandById);

// POST - create
router.post("/create", createBrand);

// PUT - update
router.put("/:id", upload.single("my_file"), updateBrand);

// DELETE
router.delete("/:id", deleteBrand);

export default router;
