import Joi from "joi";

export const sendEmailSchema = Joi.object({
  toEmail: Joi.string().email().required().messages({
    "string.email":
      "Recipient email is required and must be a valid email address.",
    "any.required": "Recipient email is required.",
  }),
  subject: Joi.string().optional().allow(""),
  textContent: Joi.string().optional().allow(""),
  htmlContent: Joi.string().optional().allow(""),
});
