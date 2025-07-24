import { Request, Response } from "express";
import Feature from "../../models/feature.model";

export const addFeatureImage = async (req: Request, res: Response) => {
  try {
    const { image } = req.body;

    const featureImage = new Feature({
      image,
    });

    await featureImage.save();

    res.status(201).json({
      success: true,
      data: featureImage,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lôi hệ thống, vui lòng thử lại sau!",
    });
  }
};

export const getFeatureImage = async (req: Request, res: Response) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};
