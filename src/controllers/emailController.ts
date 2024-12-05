import { NextFunction, Request, Response } from "express";
import { sendEmail } from "../services/mailjetService";
import { SendEmailParams } from "../interfaces/emailInterfaces";
import { sendEmailSchema } from "../validations/emailSendingValidation";
import { BadRequestError } from "../errors";

const sendEmailController = async (
  req: Request<{}, {}, SendEmailParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = sendEmailSchema.validate(req.body);
  if (error) {
   return next(new BadRequestError(error.details[0].message)); 
  }

  const { toEmail, textContent, htmlContent, subject } = req.body;

  try {
    const result = await sendEmail({
      fromEmail: process.env.EMAIL || "",
      toEmail: toEmail,
      fromName: "Book Talk",
      subject:
        subject || "It would be wonderful to discuss this book together!",
      textContent: textContent || "",
      htmlContent:
        htmlContent ||
        "<h3>Hi! We’re excited to dive into our discussion. <br>" +
          "Whether you’ve already started reading or are just about to pick it up, we’d love for you to join the conversation!</h3>",
    });
    res.status(200).json({ message: "Email sent successfully", data: result });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
};

export { sendEmailController };
