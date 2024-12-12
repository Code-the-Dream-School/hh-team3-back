import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";
import { commentJoiSchema, commentsQuerySchema } from "../validations/commentValidation";
import { IUser } from "../interfaces/userInterfaces";
import { StatusCodes } from "http-status-codes";
import Comment, { IComment } from "../models/Comment";
import { bookIdSchema } from "../validations/bookValidation";

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
    req.body.likeCount = 0;

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
    return next (new UnauthenticatedError("User is not authorized to delete this comment"));
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

  let udpatedComment = await Comment.findByIdAndUpdate(commentId, { $inc: { likeCount: 1 } }, { new: true, runValidators: true });

  if (!udpatedComment) {
    return next(new NotFoundError("Comment was not found."));
  }

  try {
    res.status(StatusCodes.OK).json({ "commentId": udpatedComment._id, "likeCount": udpatedComment.likeCount });
  } catch (error) {
    return next(error);
  }
};