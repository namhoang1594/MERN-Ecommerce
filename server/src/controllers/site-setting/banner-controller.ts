import { Request, Response } from "express";
import { BannerModel } from "../../models/site-setting/banner.model";
import { imageUploadUtil } from "../../helpers/cloudinary";


// GET all banners
// export const getAllBanners = async (req: Request, res: Response) => {
//     try {
//         const banners = await BannerModel.find(
//             {
//                 isActive: true,
//                 position: "home",
//             }
//         ).sort({ createdAt: -1 });
//         res.status(200).json({ data: banners });
//     } catch (error) {
//         res.status(500).json({ message: "Lỗi server khi lấy danh sách banner" });
//     }
// };

export const getAllBanners = async (req: Request, res: Response) => {
    try {
        const { position } = req.query;
        const filter: any = {};

        if (position) filter.position = position;

        const banners = await BannerModel.find(filter).sort({ createdAt: -1 });
        res.status(200).json(banners);
        // res.status(200).json({ data: banners });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy danh sách banner" });
    }
};


// CREATE a new banner
export const createBanner = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No image file provided" });

        const result = await imageUploadUtil(file.buffer, "banners");

        const { title, link, position } = req.body;

        const newBanner = new BannerModel({
            image: result.secure_url,
            title,
            link,
            position,
            isActive: true,
        });

        const saved = await newBanner.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: "Failed to create banner", error });
    }
};


// TOGGLE a banner
export const toggleBannerStatus = async (req: Request, res: Response) => {
    try {
        const banner = await BannerModel.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: "Banner không tồn tại." });

        banner.isActive = !banner.isActive;
        await banner.save();

        res.json({ message: "Cập nhật trạng thái thành công", banner });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err });
    }
};

// DELETE a banner
export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const deleted = await BannerModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy banner" });
        res.status(200).json({ message: "Xoá banner thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xoá banner" });
    }
};
