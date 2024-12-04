import Joi from "joi";
import mongoose from "mongoose";

export const bookJoiSchema = Joi.object({
  title: Joi.string().required(),
  googleID: Joi.string().optional(),
  link: Joi.string().uri().optional(),
  authors: Joi.array().items(Joi.string().min(1)).required(),
  publisher: Joi.string().min(1).required(),
  description: Joi.string().required(),
  publishedDate: Joi.date().iso().required(),
  categories: Joi.array().items(Joi.string().required()),
  imageLinks: Joi.object({
    smallThumbnail: Joi.string().uri().optional(),
    thumbnail: Joi.string().uri().optional(),
  }).optional(),
});

export const bookIdSchema = Joi.string()
  .custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }, "ObjectId validation")
  .required();
