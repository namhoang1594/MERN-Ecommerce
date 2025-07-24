import { Request, Response } from "express";
import { imageUploadUtil } from "../../helpers/cloudinary";
import * as productService from "../../services/admin/product.service";


export const handleImageUpload = async (req: Request, res: Response) => {
  try {
    const fileBuffer = req.file!.buffer;
    const originalname = req.file!.originalname;
    const result = await imageUploadUtil(fileBuffer, originalname);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Tải ảnh lên thất bại!",
    });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {

    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Tao sản phẩm thất bại!",
    });
  }
};

export const fetchAllProduct = async (req: Request, res: Response) => {
  try {

    const listOfProduct = await productService.getAllProducts();

    res.status(200).json({
      success: true,
      data: listOfProduct,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lấy danh sách sản phẩm thất bại!",
    });
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {

    const updateProduct = await productService.updateProduct(req.params.id, req.body);

    if (!updateProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm!",
      });
    }

    res.status(200).json({
      success: true,
      data: updateProduct,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Cập nhật sản phẩm thất bại!",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {

    const deleted = await productService.deleteProduct(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm để xóa!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sản phẩm đã được xóa thành công!",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Xóa sản phẩm thất bại!",
    });
  }
};
