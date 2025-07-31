import { Request, Response } from "express";
import { SettingModel } from "../../models/site-setting/setting.model";
import { ILogo } from "../../types/site-setting/setting.types";
import { imageDeleteUtil, imageUploadUtil } from "../../helpers/cloudinary";


// GET full setting
export const getSetting = async (req: Request, res: Response) => {
    try {
        const setting = await SettingModel.findOne();
        if (!setting) return res.status(404).json({ message: "Setting not found" });
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch setting" });
    }
};

// ADD logo (with cloudinary upload)
export const addLogo = async (req: Request, res: Response) => {
    try {
        const file = req.file;

        if (!file) return res.status(400).json({ message: "No image file provided" });

        const uploaded = await imageUploadUtil(file.buffer, "logo");
        const newLogo: ILogo = {
            image: uploaded.secure_url,
            public_id: uploaded.public_id,
            isActive: false,
        };

        let setting = await SettingModel.findOne();
        if (!setting) {
            setting = new SettingModel({ logos: [newLogo] });
        } else {
            setting.logos.push(newLogo);
        }

        await setting.save();
        res.status(201).json(setting.logos);
    } catch (error) {
        res.status(500).json({ message: "Failed to add logo" });
    }
};

// DELETE logo
export const deleteLogo = async (req: Request, res: Response) => {
    try {
        const { public_id } = req.params;
        let setting = await SettingModel.findOne();
        if (!setting) return res.status(404).json({ message: "Setting not found" });

        const targetLogo = setting.logos.find((logo) => logo.public_id === public_id);
        if (!targetLogo) return res.status(404).json({ message: "Logo not found" });

        await imageDeleteUtil(public_id);
        setting.logos = setting.logos.filter((logo) => logo.public_id !== public_id);

        await setting.save();
        res.json(setting.logos);
    } catch (error) {
        res.status(500).json({ message: "Failed to delete logo" });
    }
};

// TOGGLE logo active status (only 1 active)
export const toggleLogo = async (req: Request, res: Response) => {
    const { public_id } = req.body;

    try {
        const setting = await SettingModel.findOne();

        if (!setting) return res.status(404).json({ message: "Setting not found" });

        const updatedLogos = setting.logos.map((logo) => ({
            ...logo,
            isActive: logo.public_id === public_id
        }));

        setting.logos = updatedLogos;
        await setting.save();

        res.status(200).json(setting.logos);
    } catch (err) {
        res.status(500).json({ message: "Failed to toggle logo" });
    }
};

// UPDATE basic info (hotline, email, slogan, footerText)
export const updateInfo = async (req: Request, res: Response) => {
    try {
        const { hotline, email, slogan, footerText } = req.body;
        const setting = await SettingModel.findOneAndUpdate(
            {},
            { hotline, email, slogan, footerText },
            { new: true, upsert: true }
        );
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: "Failed to update info" });
    }
};

// UPDATE socialLinks
export const updateSocialLinks = async (req: Request, res: Response) => {
    try {
        const { socialLinks } = req.body;
        if (!Array.isArray(socialLinks)) return res.status(400).json({ message: "Invalid socialLinks" });

        const setting = await SettingModel.findOneAndUpdate(
            {},
            { socialLinks },
            { new: true, upsert: true }
        );
        res.json(setting?.socialLinks || []);
    } catch (error) {
        res.status(500).json({ message: "Failed to update socialLinks" });
    }
};
