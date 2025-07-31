import express from "express";
import {
    getAllBanners,
    createBanner,
    toggleBannerStatus,
    deleteBanner
} from "../../controllers/site-setting/banner-controller";
import { upload } from "../../helpers/cloudinary";


const router = express.Router();

// Banner routes
router.get("/banners/get", getAllBanners);
router.post("/banners/create", upload.single("image"), createBanner);
router.put("/banners/toggle/:id", toggleBannerStatus);
router.delete("/banners/:id", deleteBanner);

export default router;
