import { Request, Response } from "express";
import * as productService from "../../services/admin/product.service";
import Product from "../../models/products.model";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const createdProduct = await productService.createProductService(req.body);
    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      createdProduct,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", search = "", category, brand, status } = req.query;

    const result = await productService.getProductsService(
      parseInt(page as string),
      parseInt(limit as string),
      search as string,
      category as string,
      brand as string,
      status as string
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductByIdService(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await productService.updateProductService(req.params.id, req.body);
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { deletedImages } = req.body;
    const deleted = await productService.deleteProductService(req.params.id, deletedImages);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const toggleProductStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await productService.toggleProductStatusService(id);
    res.status(200).json({
      success: true,
      message: "Toggled product status",
      product: updated,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getFlashSaleForShop = async (req: Request, res: Response) => {
  try {
    const products = await productService.getFlashSaleForShopService();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const toggleFlashSaleStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedFlashSale = await productService.toggleFlashSaleStatusService(id);
    res.status(200).json({
      success: true,
      message: "Toggled product flash sale status",
      productFlashSale: updatedFlashSale,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getSuggestionProducts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const products = await productService.getSuggestionProductsService(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getNewArrivalProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getNewArrivalProductsService();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProductsForShop = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "20");

    const filters: any = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.brand) {
      filters.brand = req.query.brand;
    }

    const data = await productService.fetchProductsForShop(page, limit, filters);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};