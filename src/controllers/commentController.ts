import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  UnauthenticatedError,
} from "../errors";
import { IComment } from "../interfaces/commentInterfaces";
import { commentJoiSchema, commentsQuerySchema } from "../validations/commentValidation";
import { IUser } from "../interfaces/userInterfaces";
import { StatusCodes } from "http-status-codes";
import Comment from "../models/Comment";
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