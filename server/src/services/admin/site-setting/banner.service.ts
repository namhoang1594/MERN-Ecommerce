import { imageDeleteUtil } from "../../../helpers/cloudinary";
import { BannerModel } from "../../../models/site-setting/banner.model";


export const getAllBannersService = async () => {
    return await BannerModel.find().sort({ createdAt: -1 });
};

export const getBannerByIdService = async (id: string) => {
    return await BannerModel.findById(id);
};

export const createBannerService = async (data: {
    title: string;
    link?: string;
    position?: string;
    image: { url: string; public_id: string };
}) => {
    const newBanner = new BannerModel(data);
    return await newBanner.save();
};

export const updateBannerService = async (
    id: string,
    data: {
        title?: string;
        link?: string;
        position?: string;
        image?: { url: string; public_id: string };
    }
) => {
    return await BannerModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBannerService = async (id: string) => {
    const banner = await BannerModel.findById(id);
    if (!banner) throw new Error("Banner not found");

    // Xóa ảnh khỏi cloudinary trước
    if (banner.image?.public_id) {
        await imageDeleteUtil(banner.image.public_id);
    }

    await banner.deleteOne();
    return banner;
};
