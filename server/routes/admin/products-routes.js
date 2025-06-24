const express = require("express");
const router = express.Router();

const {
  handleImageUpload,
  addProduct,
  fetchAllProduct,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.get("/get", fetchAllProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
