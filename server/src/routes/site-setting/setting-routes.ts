import express from "express";
import {
    addLogo,
    deleteLogo,
    getSetting,
    toggleLogo,
    updateInfo,
    updateSocialLinks
} from "../../controllers/site-setting/setting-controller";
import { upload } from "../../helpers/cloudinary";


const router = express.Router();

router.get("/get", getSetting);
router.post("/logos", upload.single("image"), addLogo);
router.delete("/logos/:public_id", deleteLogo);
router.put("/logos/logo/:public_id/toggle", toggleLogo);
router.patch("/info", updateInfo);
router.patch("/social-links", updateSocialLinks);


export default router;