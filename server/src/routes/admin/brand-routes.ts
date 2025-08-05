import express from "express";
import {
    createBrand,
    deleteBrand,
    getAllBrands,
    getBrandById,
    updateBrand
} from "../../controllers/admin/brand-controller";
import { imageUploadUtil, upload } from "../../helpers/cloudinary";


const router = express.Router();

router.post("/upload-image", upload.single("my_file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const result = await imageUploadUtil(req.file.buffer, "brands");

        res.status(200).json({
            success: true,
            result: {
                url: result.secure_url,
                public_id: result.public_id,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Image upload failed" });
    }
});


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
