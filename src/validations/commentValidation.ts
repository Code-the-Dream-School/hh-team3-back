import Joi from "joi";
import { bookIdSchema } from "./bookValidation";

export const commentJoiSchema = Joi.object({
  user: Joi.string(),
  book: Joi.string().required(),
  text: Joi.string().required(),
});

export const commentsQuerySchema = Joi.object({
 bookId: bookIdSchema.optional(),
});

