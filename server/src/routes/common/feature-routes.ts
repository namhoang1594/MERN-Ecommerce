import { Router } from "express";
import {
  addFeatureImage,
  getFeatureImage,
} from "../../controllers/common/feature-controller";

const router = Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImage);

export default router;
