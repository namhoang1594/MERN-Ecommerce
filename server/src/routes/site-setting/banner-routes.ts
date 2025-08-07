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
router.get("/get", getAllBanners);
router.post("/create", upload.single("image"), createBanner);
router.put("/toggle/:id", toggleBannerStatus);
router.delete("/:id", deleteBanner);

export default router;
