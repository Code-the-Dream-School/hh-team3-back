import cloudinary from "../config/cloudinaryConfig";
import {
  UploadOptions,
  UploadResult,
  UploadResponse,
} from "../interfaces/photoInterfaces";

const uploadPhoto = async (
  file: Express.Multer.File,
  { folder, width, height }: UploadOptions
) => {
  try {
    if (!file.buffer) {
      throw new Error("No file buffer available");
    }

    const uploadResult = await new Promise<UploadResult>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: `avatar_${Date.now()}`, folder: folder },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result as UploadResult);
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
      width: width,
      height: height,
    });

    return { uploadResult, optimizeUrl, autoCropUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(`Error uploading image`);
  }
};

const deletePhoto = async (
  publicId: string
): Promise<{ success: boolean }> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result == "ok" };
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return { success: false };
  }
};

export { uploadPhoto, deletePhoto };
