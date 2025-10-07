import { Request, Response } from "express";
import { BannerModel } from "../../models/site-setting/banner.model";
import { imageDeleteUtil, imageUploadUtil } from "../../helpers/cloudinary";
import { BannerPosition } from "../../types/site-setting/banner.types";

// GET public banners (Chỉ lấy active banners cho FE user)
export const getPublicBanners = async (req: Request, res: Response) => {
    try {
        const { position } = req.query;
        const filter: any = { isActive: true }; // Chỉ lấy active

        if (position && Object.values(BannerPosition).includes(position as BannerPosition)) {
            filter.position = position;
        }

        const banners = await BannerModel
            .find(filter)
            .sort({ position: 1, createdAt: -1 })
            .select('-__v') // Bỏ field __v cho gọn
            .lean();

        res.status(200).json({
            success: true,
            count: banners.length,
            data: banners
        });
    } catch (error) {
        console.error("Error getting public banners:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách banner"
        });
    }
};

// GET all banners (ADMIN only - bao gồm cả inactive)
export const getAllBanners = async (req: Request, res: Response) => {
    try {
        const { position, isActive } = req.query;
        const filter: any = {};

        if (position && Object.values(BannerPosition).includes(position as BannerPosition)) {
            filter.position = position;
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const banners = await BannerModel
            .find(filter)
            .sort({ position: 1, createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: banners.length,
            data: banners
        });
    } catch (error) {
        console.error("Error getting banners:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách banner"
        });
    }
};

// CREATE a new banner
export const createBanner = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng upload ảnh banner"
            });
        }

        // Validate position
        const { title, link, position = BannerPosition.MAIN } = req.body;
        if (position && !Object.values(BannerPosition).includes(position)) {
            return res.status(400).json({
                success: false,
                message: "Position không hợp lệ"
            });
        }

        // Upload image to Cloudinary
        const uploadResult = await imageUploadUtil(file.buffer, "banners");

        // Create banner
        const newBanner = new BannerModel({
            image: {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            },
            title: title?.trim(),
            link: link?.trim(),
            position,
            isActive: true,
        });

        const saved = await newBanner.save();

        res.status(201).json({
            success: true,
            message: "Tạo banner thành công",
            data: saved
        });
    } catch (error) {
        console.error("Error creating banner:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi tạo banner"
        });
    }
};

// UPDATE banner
export const updateBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, link, position } = req.body;
        const file = req.file;

        const banner = await BannerModel.findById(id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner không tồn tại"
            });
        }

        // Update image if new file uploaded
        if (file) {
            // Delete old image from Cloudinary
            if (banner.image.public_id) {
                await imageDeleteUtil(banner.image.public_id);
            }

            // Upload new image
            const uploadResult = await imageUploadUtil(file.buffer, "banners");
            banner.image = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            };
        }

        // Update other fields
        if (title !== undefined) banner.title = title.trim();
        if (link !== undefined) banner.link = link.trim();
        if (position && Object.values(BannerPosition).includes(position)) {
            banner.position = position;
        }

        const updated = await banner.save();

        res.status(200).json({
            success: true,
            message: "Cập nhật banner thành công",
            data: updated
        });
    } catch (error) {
        console.error("Error updating banner:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật banner"
        });
    }
};

// TOGGLE banner status
export const toggleBannerStatus = async (req: Request, res: Response) => {
    try {
        const banner = await BannerModel.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner không tồn tại"
            });
        }

        banner.isActive = !banner.isActive;
        await banner.save();

        res.status(200).json({
            success: true,
            message: `Banner đã ${banner.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`,
            data: banner
        });
    } catch (error) {
        console.error("Error toggling banner:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

// DELETE banner
export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const banner = await BannerModel.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy banner"
            });
        }

        // Delete image from Cloudinary
        if (banner.image.public_id) {
            await imageDeleteUtil(banner.image.public_id);
        }

        // Delete banner from DB
        await BannerModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Xóa banner thành công"
        });
    } catch (error) {
        console.error("Error deleting banner:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi xóa banner"
        });
    }
};