import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";
import {
  discussionsQuerySchema,
  discussionJoiSchema,
  discussionIdSchema,
} from "../validations/discussionValidation";
import { IDiscussion, IGetDiscussionsQuery, IJoinDiscussionBody } from "../interfaces/discussionInterfaces";
import Discussion from "../models/Discussion";
import { IUser } from "../interfaces/userInterfaces";
import { sendEmail } from "../services/mailjetService";

const getAllDiscussions = async (
  req: Request<{}, {}, {}, IGetDiscussionsQuery & { bookId?: string }>,
  res: Response,
  next: NextFunction
) => {
  const { error } = discussionsQuerySchema.validate(req.query);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

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
  const { error } = discussionIdSchema.validate(req.params);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }
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
  const { error } = discussionIdSchema.validate(req.params);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }
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

  const { error } = discussionIdSchema.validate(req.params);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }
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
  const { error } = discussionIdSchema.validate(req.params);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }
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

     const meetingTime = new Date(discussion.date).toLocaleString();
     const meetingLink = discussion.meetingLink;

    const emailContent = {
      toEmail: user.email,
      subject: `You've joined the discussion: ${discussion.title}`,
      htmlContent: `<h3>Hi ${user.name},</h3>
                    <p>You have successfully joined the discussion: <strong>"${discussion.title}"</strong>.</p>
                    <p><strong>Discussion time:</strong> ${meetingTime}</p>
                    <p><strong>Join the discussion here:</strong> <a href="${meetingLink}">Click to join</a></p>
                    <p>We are excited to have you participate!</p>`,
    };

    await sendEmail({
      fromEmail: process.env.EMAIL || "",
      toEmail: emailContent.toEmail,
      fromName: "Book Talk",
      subject: emailContent.subject,
      textContent: "",
      htmlContent: emailContent.htmlContent,
    });

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
  const { error } = discussionIdSchema.validate(req.params);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }
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

    const meetingTime = new Date(discussion.date).toLocaleString();
    const emailContent = {
      toEmail: user.email,
      subject: `Successfully Unsubscribed – We’ll Miss You!`,
      htmlContent: `<h3>Hi ${user.name},</h3>
                    <p>You have successfully unsubscribed from discussion: <strong>"${discussion.title}"</strong>.</p>
                    <p><strong>Discussion time:</strong> ${meetingTime}</p>
                    <p><strong>We hope to see you in future discussions</p>`,
    };
    await sendEmail({
      fromEmail: process.env.EMAIL || "",
      toEmail: emailContent.toEmail,
      fromName: "Book Talk",
      subject: emailContent.subject,
      textContent: "",
      htmlContent: emailContent.htmlContent,
    });

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
