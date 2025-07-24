import { Request, Response } from "express";
import {
  createAddress,
  getAddressesByUserId,
  updateAddress,
  removeAddress
} from "../../services/shop/address.service";


export const addAddress = async (req: Request, res: Response) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;

    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: "Tất cả các trường là bắt buộc!",
      });
    }

    const newCreatedAddress = await createAddress({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });

    res.status(201).json({
      success: true,
      data: newCreatedAddress,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};

export const fetchAllAddress = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Tên người dùng là bắt buộc!",
      });
    }

    const addressList = await getAddressesByUserId(userId);

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};

export const editAddress = async (req: Request, res: Response) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Tên người dùng và địa chỉ là bắt buộc!",
      });
    }

    const updated = await updateAddress(userId, addressId, formData);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ!",
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Tên người dùng và địa chỉ là bắt buộc!",
      });
    }

    const deleted = await removeAddress(userId, addressId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa địa chỉ thành công!",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};