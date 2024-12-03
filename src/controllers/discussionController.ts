import { Request, Response, NextFunction } from "express";
import Discussion, { IDiscussion } from "../models/Discussion";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";
import Joi from "joi";
import mongoose from "mongoose";
import { IUser } from "../models/User";

const discussionJoiSchema = Joi.object({
  title: Joi.string().required(),
  book: Joi.string().required(),
  content: Joi.string().required(),
  date: Joi.date().iso().required(),
  participants: Joi.array().items(Joi.string()).optional(),
  meetingLink: Joi.string().uri().required(),
  createdBy: Joi.string().required(),
});

interface IGetDiscussionsQuery {
  search?: string;
  sort?: "latest" | "oldest";
}

interface IJoinDiscussionBody {
  user: mongoose.Schema.Types.ObjectId;
}

const getAllDiscussions = async (
  req: Request<{}, {}, {}, IGetDiscussionsQuery & { bookId?: string }>,
  res: Response,
  next: NextFunction
) => {
  const { search, sort, bookId } = req.query;

  let query: any = {};

  if (bookId) {
    query.book = bookId;
  }

  if (search) {
    query.title = { $regex: new RegExp(search, "i") };
  }

  const sortOptions: any = {};
  if (sort) {
    if (sort === "latest") sortOptions.date = -1;
    else if (sort === "oldest") sortOptions.date = 1;
  } else {
    sortOptions.date = -1;
  }

  try {
    const discussions = await Discussion.find(query).sort(sortOptions);
    res.status(StatusCodes.OK).json({ discussions, count: discussions.length });
  } catch (error) {
    return next(error);
  }
};

const getDiscussion = async (
  req: Request<{ discussionId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { discussionId } = req.params;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return next(new NotFoundError(`No discussion with id ${discussionId}`));
    }
    res.status(StatusCodes.OK).json({ discussion });
  } catch (error) {
    return next(error);
  }
};

const createDiscussion = async (
  req: Request<{}, {}, IDiscussion>,
  res: Response,
  next: NextFunction
) => {
  const { error } = discussionJoiSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const user: IUser | undefined = req.user;

  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  try {
    req.body.createdBy = user.userId;
    const discussion = await Discussion.create(req.body);
    res.status(StatusCodes.CREATED).json({ discussion });
  } catch (error) {
    return next(error);
  }
};

const deleteDiscussion = async (
  req: Request<{ discussionId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { discussionId } = req.params;
  const user: IUser | undefined = req.user;

  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

   const discussion = await Discussion.findById(discussionId);
   if (!discussion) {
     return next(new NotFoundError(`No discussion with id ${discussionId}`));
   }

   if (
     discussion.createdBy &&
     user.userId.toString() !== discussion.createdBy.toString()
   ) {
     return next(
       new UnauthenticatedError(
         "You are not authorized to delete this discussion"
       )
     );
   }

  try {
    await discussion.deleteOne();
    res.status(StatusCodes.OK).send();
  } catch (error) {
    return next(error);
  }
};


const updateDiscussion = async (
  req: Request<{ discussionId: string }, {}, Partial<IDiscussion>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { discussionId } = req.params;
  const user: IUser | undefined = req.user;

  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return next(
        new NotFoundError(`No discussion found with id ${discussionId}`)
      );
    }

   if (
     discussion.createdBy &&
     user.userId.toString() !== discussion.createdBy.toString()
   ) {
     return next(
       new UnauthenticatedError(
         "You are not authorized to update this discussion"
       )
     );
   }

    if (req.body.title) discussion.title = req.body.title;
    if (req.body.content) discussion.content = req.body.content;
    if (req.body.date) discussion.date = req.body.date;
    if (req.body.meetingLink) discussion.meetingLink = req.body.meetingLink;

  try {
    await discussion.save();
    res.status(200).json(discussion);
  } catch (error) {
    return next(error);
  }
};



const joinDiscussion = async (
  req: Request<{ discussionId: string }, {}, IJoinDiscussionBody>,
  res: Response,
  next: NextFunction
) => {
  const { discussionId } = req.params;
  const user: IUser | undefined = req.user;

  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return next(new NotFoundError(`No discussion with id ${discussionId}`));
    }

    if (discussion.participants.includes(user.userId)) {
      return next(new BadRequestError("You are already a participant"));
    }

    discussion.participants.push(user.userId);
    await discussion.save();
    res.status(StatusCodes.OK).json({ discussion });
  } catch (error) {
    return next(error);
  }
};

const unjoinDiscussion = async (
  req: Request<{ discussionId: string }, {}, IJoinDiscussionBody>,
  res: Response,
  next: NextFunction
) => {
  const { discussionId } = req.params;
  const user: IUser | undefined = req.user;

  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return next(new NotFoundError(`No discussion with id ${discussionId}`));
    }

    const participantIndex = discussion.participants.indexOf(user.userId);
    if (participantIndex === -1) {
      return next(
        new BadRequestError("You are not a participant in this discussion")
      );
    }

    discussion.participants.splice(participantIndex, 1);
    await discussion.save();
    res.status(StatusCodes.OK).json({ discussion });
  } catch (error) {
    return next(error);
  }
};

const sendEmailToParticipants = async (discussionId: string) => {
  throw new Error("Function not implemented.");
};

export {
  createDiscussion,
  getAllDiscussions,
  getDiscussion,
  deleteDiscussion,
  updateDiscussion,
  joinDiscussion,
  unjoinDiscussion,
  sendEmailToParticipants,
};
