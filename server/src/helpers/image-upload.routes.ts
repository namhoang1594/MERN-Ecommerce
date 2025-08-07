import { Router } from "express";
import { imageUploadUtil, upload } from "./cloudinary";

const router = Router();

const allowedFolders = ["brands", "categories", "products"];

router.post("/upload-image", async (req, res) => {
    const isMultiple = req.query.multiple === "true";

    const handler = isMultiple
        ? upload.array("images", 10)
        : upload.single("my_file");

    handler(req, res, async (err) => {
        try {
            if (err) {
                return res.status(400).json({ message: "Upload error", error: err.message });
            }

            const { folder } = req.body;
            const targetFolder = allowedFolders.includes(folder) ? folder : "default";

            if (isMultiple) {
                const files = req.files as Express.Multer.File[];

                if (!files || files.length === 0) {
                    return res.status(400).json({ message: "No files uploaded" });
                }

                if (files.length > 10) {
                    return res.status(400).json({ message: "Maximum 10 images allowed" });
                }

                const uploadResults = await Promise.all(
                    files.map((file) => imageUploadUtil(file.buffer, targetFolder))
                );

                const urls = uploadResults.map((r) => ({
                    url: r.secure_url,
                    public_id: r.public_id,
                }));

                return res.status(200).json({
                    success: true,
                    result: urls,
                });
            } else {
                const file = req.file;

                if (!file) {
                    return res.status(400).json({ message: "No file uploaded" });
                }

                const result = await imageUploadUtil(file.buffer, targetFolder);

                return res.status(200).json({
                    success: true,
                    result: {
                        url: result.secure_url,
                        public_id: result.public_id,
                    },
                });
            }
        } catch (error) {
            return res.status(500).json({ message: "Image upload failed" });
        }
    });
});

export default router;
