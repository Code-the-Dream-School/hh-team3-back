import Joi from "joi";

export const registerJoiSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": '"name" should be a type of text',
    "string.empty": '"name" cannot be empty',
    "any.required": '"name" is required',
  }),
  email: Joi.string().email().required().messages({
    "string.email": '"email" must be a valid email',
    "any.required": '"email" is required',
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": '"password" should be a type of text',
    "string.empty": '"password" cannot be empty',
    "string.min": '"password" should have a minimum length of 6 characters',
    "any.required": '"password" is required',
  }),
  role: Joi.string()
    .valid("user", "admin")
    .optional()
    .default("user")
    .messages({
      "string.valid": '"role" should be either "user" or "admin"',
    }),
});

export const loginJoiSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Please provide an email",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Please provide a password",
  }),
});

export const updateUserProfileJoiSchema = Joi.object({
  name: Joi.string().trim().min(1).optional(),
  email: Joi.string().email().trim().min(1).optional(),
  role: Joi.string().valid("user", "admin").optional(),
});

export const requestPasswordResetJoiSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
});

export const resetPasswordJoiSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Token is required",
    "any.required": "Token is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 6 characters long",
    "any.required": "New password is required",
  }),
});