import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";
import { commentJoiSchema, commentsQuerySchema } from "../validations/commentValidation";
import { IUser } from "../interfaces/userInterfaces";
import { StatusCodes } from "http-status-codes";
import Comment from "../models/Comment";
import { IComment } from "../interfaces/commentInterfaces";
import mongoose, { Types, ObjectId } from "mongoose";

export const createCommentToBook = async (
  req: Request<{}, {}, IComment>,
  res: Response,
  next: NextFunction
) => {
  const { error } = commentJoiSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const user: IUser | undefined = req.user;
  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  try {
    req.body.user = user.userId;
    // req.body.likeCount = user.userId;

    const comment = await Comment.create(req.body);
    res.status(StatusCodes.CREATED).json({ comment });

  } catch (error) {
    return next(error);
  }
};

export const getComments = async (
  req: Request<{}, {}, {}, { bookId?: string }>,
  res: Response,
  next: NextFunction
) => {
  const { error } = commentsQuerySchema.validate(req.query);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const { bookId } = req.query;

  let query: any = {};

  if (bookId) {
    query.book = bookId;
  }

  try {
    const comments = await Comment.find(query).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({ comments, count: comments.length });
  } catch (error) {
    return next(error);
  }
};

export const deleteCommentToBook = async (
  req: Request<{ commentId: string }, {}, {}, { bookId?: string }>,
  res: Response,
  next: NextFunction
) => {
  const { commentId } = req.params;

  const user: IUser | undefined = req.user;
  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new NotFoundError("Comment was not found."));
  }

  if (user.userId == comment.user) {
    await Comment.findByIdAndDelete(commentId);
  } else {
    return next(new UnauthenticatedError("User is not authorized to delete this comment"));
  }

  try {
    res.status(StatusCodes.OK).json({ message: "Comment was successfully deleted" });
  } catch (error) {
    return next(error);
  }
};

export const likeCommentToBook = async (
  req: Request<{ commentId: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {

  const { commentId } = req.params;

  const userId = req.user.userId;

  if (!userId) {
    return next(new UnauthenticatedError("User not authenticated"));
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new NotFoundError("Comment not found"));
  }

  const isLiked = comment.likes.some(like => like.toString() === userId);

  try {
    if (isLiked) {
      comment.likes = comment.likes.filter(like => like.toString() !== userId);
      comment.likeCount = comment.likes.length;
      await comment.save();
      res.status(StatusCodes.OK).json({ message: "Your like has been removed!" });
    } else {
      comment.likes.push(userId);
      comment.likeCount = comment.likes.length;
      await comment.save();
      res.status(StatusCodes.OK).json({ message: "You liked the comment!" });
    }
  } catch (error) {
    return next(error);
  }
};