
// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Accept either CLOUDINARY_CLOUD_NAME or CLOUDINARY_NAME for backwards compatibility:
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.warn(
    "⚠️ Warning: Cloudinary env vars missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
  );
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

/**
 * uploadOnCloudinary(file, options)
 * 
 * Handles multiple input formats:
 * 1. Buffer object: { buffer: Buffer, originalname: string }
 * 2. File path string: "/path/to/file.jpg"
 * 3. Multer file object: { path: string, ... }
 * 
 * @param {Object|String} fileInput - The file to upload
 * @param {Object} options - Cloudinary upload options
 * @returns {Promise<Object>} { secure_url, public_id, raw }
 */
const uploadOnCloudinary = async (fileInput, options = {}) => {
  try {
    // ✅ Validation
    if (!fileInput) {
      throw new Error("No file input provided to uploadOnCloudinary");
    }

    

    // ✅ CASE 1: Buffer input (memoryStorage) - RECOMMENDED for both resume & images
    if (fileInput.buffer && Buffer.isBuffer(fileInput.buffer)) {
      
      
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: options.folder || "uploads",
            ...options
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary upload_stream error:", error);
              return reject(error);
            }
            
            return resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              raw: result
            });
          }
        );
        uploadStream.end(fileInput.buffer);
      });
    }

    // ✅ CASE 2: Multer file object with path (diskStorage)
    if (fileInput.path && typeof fileInput.path === "string") {
      
      
      const result = await cloudinary.uploader.upload(fileInput.path, {
        resource_type: "auto",
        folder: options.folder || "uploads",
        ...options
      });

      // Clean up local file
      try {
        await fs.promises.unlink(fileInput.path);
        
      } catch (unlinkError) {
        console.warn("⚠️ Could not delete local file:", unlinkError.message);
      }

      
      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        raw: result
      };
    }

    // ✅ CASE 3: Direct file path string
    if (typeof fileInput === "string") {
      
      
      const result = await cloudinary.uploader.upload(fileInput, {
        resource_type: "auto",
        folder: options.folder || "uploads",
        ...options
      });

      // Try to remove local file if it exists
      try {
        if (fs.existsSync(fileInput)) {
          await fs.promises.unlink(fileInput);
          
        }
      } catch (unlinkError) {
        console.warn("⚠️ Could not delete local file:", unlinkError.message);
      }

      
      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        raw: result
      };
    }

    // ❌ Unsupported format
    throw new Error("Unsupported fileInput format. Expected buffer, path string, or multer file object");

  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message || error);
    throw error;
  }
};

/**
 * deleteFromCloudinary(publicId)
 * Deletes a file from Cloudinary using its public_id
 * 
 * @param {String} publicId - The public_id of the file to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("No public_id provided for deletion");
    }

    
    const result = await cloudinary.uploader.destroy(publicId);
   
    return result;
  } catch (error) {
    console.error("❌ Cloudinary deletion failed:", error.message || error);
    throw error;
  }
};

export default uploadOnCloudinary;