const express = require("express");
const router = express.Router();

const {
  addFeatureImage,
  getFeatureImage,
} = require("../../controllers/common/feature-controller");

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImage);

module.exports = router;
