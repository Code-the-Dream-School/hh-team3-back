import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";
import {
  commentIdSchema,
  commentJoiSchema,
  commentsQuerySchema,
} from "../validations/commentValidation";
import { StatusCodes } from "http-status-codes";
import Comment, { IComment } from "../models/Comment";
import { IUser } from "../models/User";

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
    const comment = await Comment.create(req.body);
    res.status(StatusCodes.CREATED).json({ comment });
  } catch (error) {
    return next(error);
  }
};

export const getComments = async (
  req: Request<{}, {}, {}, { itemId?: string }>,
  res: Response,
  next: NextFunction
) => {
  const { error } = commentsQuerySchema.validate(req.query);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const { itemId } = req.query;
  try {
   const comments = await Comment.find({
     $or: [{ book: itemId }, { discussion: itemId }],
   }).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({ comments, count: comments.length });
  } catch (error) {
    return next(error);
  }
};

export const deleteCommentToBook = async (
  req: Request<{ commentId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { error } = commentIdSchema.validate(req.params.commentId);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

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
    return next(
      new UnauthenticatedError("User is not authorized to delete this comment")
    );
  }

  try {
    res
      .status(StatusCodes.OK)
      .json({ message: "Comment was successfully deleted" });
  } catch (error) {
    return next(error);
  }
};

export const likeCommentToBook = async (
  req: Request<{ commentId: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { error } = commentIdSchema.validate(req.params.commentId);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const { commentId } = req.params;

 const user: IUser | undefined = req.user;
 if (!user) {
   return next(new UnauthenticatedError("User is not authenticated"));
 }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new NotFoundError("Comment not found"));
  }

  const isLiked = comment.likes.some((like) => like.toString() === user.userId.toString())

  try {
    if (isLiked) {
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== user.userId.toString()
      );
      comment.likeCount = comment.likes.length;
      await comment.save();
      res
        .status(StatusCodes.OK)
        .json({ message: "Your like has been removed!" });
    } else {
      comment.likes.push(user.userId);
      comment.likeCount = comment.likes.length;
      await comment.save();
      res.status(StatusCodes.OK).json({ message: "You liked the comment!" });
    }
  } catch (error) {
    return next(error);
  }
};
