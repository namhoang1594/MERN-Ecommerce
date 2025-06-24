const { imageUploadUtil } = require("../../helpers/cloudinary");
const products = require("../../models/products");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error Occured!",
    });
  }
};

// Add a new product

const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const newCreateProduct = new products({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });
    await newCreateProduct.save();
    res.status(201).json({
      success: true,
      data: newCreateProduct,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error Occured!",
    });
  }
};

const fetchAllProduct = async (req, res) => {
  try {
    const listOfProduct = await products.find({});
    res.status(200).json({
      success: true,
      data: listOfProduct,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error Occured!",
    });
  }
};

let editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const findProduct = await products.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    findProduct.image = image || findProduct.image;
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;

    await findProduct.save();
    res.status(201).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error Occured!",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await products.findByIdAndDelete(id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    res.status(200).json({
      success: true,
      message: "Product delete successfully!",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error Occured!",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProduct,
  editProduct,
  deleteProduct,
};
