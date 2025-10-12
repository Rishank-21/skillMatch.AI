import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const uploadOnCloudinary = async (fileInput) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    
    if (fileInput && fileInput.buffer) {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(fileInput.buffer);
      });
    }

    
    const result = await cloudinary.uploader.upload(fileInput, {
      resource_type: "auto",
    });
    
    try {
      await fs.promises.unlink(fileInput);
    } catch (e) {
      /* ignore helper */
    }
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // rethrow so callers can handle/report it
    throw error;
  }
};
export default uploadOnCloudinary;
