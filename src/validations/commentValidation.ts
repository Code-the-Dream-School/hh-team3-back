import Joi from "joi";
import { bookIdSchema } from "./bookValidation";

export const commentJoiSchema = Joi.object({
  book: Joi.string(),
  discussion: Joi.string(),
  text: Joi.string().required(),
}).xor("book", "discussion");

export const commentsQuerySchema = Joi.object({
  itemId: bookIdSchema.required(),
});

export const commentIdSchema = Joi.string().hex().length(24).required().messages({
  "string.hex": "Invalid comment ID format.",
  "string.length": "Comment ID must be 24 characters long.",
  "any.required": "Comment ID is required.",
});

