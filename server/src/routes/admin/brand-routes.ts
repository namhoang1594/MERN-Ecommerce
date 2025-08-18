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
router.get("/", getAllBrands);
router.get("/:id", getBrandById);
router.post("/create", createBrand);
router.put("/:id", upload.single("my_file"), updateBrand);
router.delete("/:id", deleteBrand);

export default router;
