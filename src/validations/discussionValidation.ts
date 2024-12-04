import Joi from "joi";
import { bookIdSchema } from "./bookValidation";

export const discussionJoiSchema = Joi.object({
  title: Joi.string().required(),
  book: Joi.string().required(),
  discussionId: Joi.string().hex().length(24).messages({
    'string.hex': 'Invalid discussion ID format',
    'string.length': 'Discussion ID must be a 24-character string',
  }),
  content: Joi.string().required(),
  date: Joi.date().iso().required(),
  participants: Joi.array().items(Joi.string()).optional(),
  meetingLink: Joi.string().uri().required(),
  createdBy: Joi.string().required(),
});

export const discussionIdSchema = Joi.object({
  discussionId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid discussion ID format",
    "string.length": "Discussion ID must be a 24-character string",
    "any.required": "Discussion ID is required",
  }),
});


export const discussionsQuerySchema = Joi.object({
  search: Joi.string().optional(),
  sort: Joi.string().valid("latest", "oldest").optional(),
  bookId: bookIdSchema.optional(),
});
