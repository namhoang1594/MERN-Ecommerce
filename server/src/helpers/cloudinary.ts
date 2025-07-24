import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const imageUploadUtil = async (fileBuffer: Buffer, filename: string) => {
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        public_id: filename
      },
      (error, result) => {
        if (error || !result) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(fileBuffer);
  });

  return result;
};

export { upload };


