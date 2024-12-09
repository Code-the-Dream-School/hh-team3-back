import Joi from "joi";
import { bookIdSchema } from "./bookValidation";

export const commentJoiSchema = Joi.object({
  book: Joi.string().required(),
  text: Joi.string().required(),
});

export const commentsQuerySchema = Joi.object({
 bookId: bookIdSchema.optional(),
});

