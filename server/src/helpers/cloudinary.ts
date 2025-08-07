import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình multer lưu vào bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const imageUploadUtil = async (
  fileBuffer: Buffer,
  folder: string
) => {
  const uniqueId = uuidv4();
  const public_id = `${folder}/${uniqueId}`;
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          public_id,
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(fileBuffer);
  });

  return result;
};

export const imageDeleteUtil = async (public_id: string): Promise<void> => {
  const result = await cloudinary.uploader.destroy(public_id, { resource_type: "image" });
  return result;
};

export { upload };
