import { NextFunction, Request, Response } from "express";
import { deletePhoto, uploadPhoto } from "../services/photoService";
import User, { IUser } from "../models/User";
import { NotFoundError, UnauthenticatedError } from "../errors";

export const uploadPhotoController = async (
  req: Request,
  res: Response, 
  next: NextFunction
): Promise<void> => {

  const user: IUser | undefined = req.user;

  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded." });
      return;
    }

    const { uploadResult, optimizeUrl, autoCropUrl } = await uploadPhoto(
      req.file
    );

    const userProfile = await User.findOne({ "_id": user.userId});
        
    if (!userProfile) {
      return next(new NotFoundError("The user was not found"));
    }

    userProfile.photoId = uploadResult.public_id;
    userProfile.photo = optimizeUrl;
    await userProfile.save();


    res.json({
      message: "Avatar uploaded successfully!",
      imageUrl: uploadResult.secure_url,
      optimizedUrl: optimizeUrl,
      autoCroppedUrl: autoCropUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading avatar" });
  }
};

export const deletePhotoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user: IUser | undefined = req.user;

  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  try {
    const userProfile = await User.findOne({ "_id": user.userId});

    if (!userProfile) {
      return next(new NotFoundError("The user was not found"));
    }

    if (!userProfile.photoId) {
      return next(new NotFoundError("No photo to delete"));
    }

    const deleteResult = await deletePhoto(userProfile.photoId);
    if (deleteResult.success) {
      userProfile.photo = "";
      userProfile.photoId = "";
      await userProfile.save();

      res.json({
        message: "Photo deleted successfully!",
      });
    } else {
      res
        .status(500)
        .json({ message: "Error deleting the photo from cloud storage" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting avatar" });
  }
};
