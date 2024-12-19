import { NextFunction, Request, Response } from "express";
import { deletePhoto, uploadPhoto } from "../services/photoService";
import User, { IUser } from "../models/User";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors";
import Book from "../models/Book";

export const uploadUserAvatarController = async (
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
      return next(new BadRequestError("file is required")); 
    }

    const { uploadResult, optimizeUrl, autoCropUrl } = await uploadPhoto(
      req.file,
      {
        folder: "avatars",
        width: 150,
        height: 150,
      }
    );

    const userProfile = await User.findOne({ _id: user.userId });

    if (!userProfile) {
      return next(new NotFoundError("User not found"));
    }

    userProfile.photoId = uploadResult.public_id;
    userProfile.photo = autoCropUrl;
    await userProfile.save();

    res.status(200).json({
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

export const uploadBookCoverController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user: IUser | undefined = req.user;
  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  const { bookId } = req.body;
  if (!bookId) {
     return next(
      new BadRequestError(
        "bookId' are required."
      )
    ); 
  }

  try {
     if (!req.file) {
       return next(new BadRequestError("file is required"));
     }


    const { uploadResult, optimizeUrl, autoCropUrl } = await uploadPhoto(
      req.file,
      {
        folder: "covers",
        width: 1200,
        height: 1800,
      }
    );

    const book = await Book.findById(bookId);

    if (!book) {
      return next(new NotFoundError("Book not found"));
    }

    book.imageLinks.bookCoverId = uploadResult.public_id;
    book.imageLinks.thumbnail = autoCropUrl;
    book.imageLinks.smallThumbnail = optimizeUrl;
    await book.save();

    res.json({
      message: "Book cover uploaded successfully!",
      imageUrl: uploadResult.secure_url,
      optimizedUrl: optimizeUrl,
      autoCroppedUrl: autoCropUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading book cover" });
  }
};

export const deleteAvatarController = async (
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
      return next(new BadRequestError("No photo to delete"));
    }

    const deleteResult = await deletePhoto(userProfile.photoId);
    if (deleteResult.success) {
      userProfile.photo = "";
      userProfile.photoId = "";
      await userProfile.save();

      res.status(200).json({
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

export const deleteBookCoverController = async (
  req: Request<{ bookId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { bookId } = req.params;

  const user: IUser | undefined = req.user;
  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return next(new NotFoundError("Book not found"));
    }

    if (!book.imageLinks.bookCoverId) {
      return next(new NotFoundError("No cover to delete for this book"));
    }

    const deleteResult = await deletePhoto(book.imageLinks.bookCoverId);
    if (deleteResult.success) {
      book.imageLinks.bookCoverId = "";
      book.imageLinks.thumbnail = "";
      book.imageLinks.smallThumbnail = "";
      await book.save();

      res.json({
        message: "Book cover deleted successfully!",
      });
    } else {
      res.status(500).json({
        message: "Error deleting the book cover from cloud storage",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting book cover" });
  }
};

