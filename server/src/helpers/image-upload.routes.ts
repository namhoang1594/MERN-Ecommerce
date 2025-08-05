import { Router } from "express";
import { imageUploadUtil, upload } from "./cloudinary";

const router = Router();

const allowedFolders = ["brands", "categories", "products"];

router.post("/upload-image", upload.single("my_file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const { folder } = req.body;
        const targetFolder = allowedFolders.includes(folder) ? folder : "default";

        const result = await imageUploadUtil(req.file.buffer, targetFolder);

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

export default router;


