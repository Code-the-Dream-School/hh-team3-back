import { UploadedFile } from "express-fileupload";
import cloudinary from "../config/cloudinaryConfig";

const uploadPhoto = async (file: Express.Multer.File) => {
  try {
    if (!file.buffer) {
      throw new Error("No file buffer available");
    }

   const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: `avatar_${Date.now()}`, folder: "avatars" },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );

      stream.end(file.buffer);
    });

   const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });

    const autoCropUrl = cloudinary.url(uploadResult.public_id, {
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
    });

    return { uploadResult, optimizeUrl, autoCropUrl };
  } catch (error) {
    throw new Error(`Error uploading image`);
  }
};

const deletePhoto = async (
  publicId: string
): Promise<{ success: boolean }> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return { success: false };
  }
};

export { uploadPhoto, deletePhoto };
