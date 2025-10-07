import express from "express";
import {
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    getPublicBanners,
    toggleBannerStatus,
} from "../../controllers/site-setting/banner-controller";
import { upload } from "../../helpers/cloudinary";
import { requireAdmin, verifyToken } from "../../middlewares/auth/auth";


const router = express.Router();

router.get("/public", getPublicBanners);

// Banner admin routes
router.use(verifyToken, requireAdmin);
router.get("/get", getAllBanners);
router.post("/create", upload.single("image"), createBanner);
router.put("/update/:id", upload.single("image"), updateBanner);
router.patch("/toggle/:id", toggleBannerStatus);
router.delete("/:id", deleteBanner);

export default router;
