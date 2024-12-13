import { BadRequestError } from "../errors";
import { SendEmailParams } from "../interfaces/emailInterfaces";
const mailjet = require("node-mailjet");


const mailjetApiKey = process.env.MAILJET_API_KEY;
const mailjetApiSecret = process.env.MAILJET_API_SECRET;

if (!mailjetApiKey || !mailjetApiSecret) {
  throw new BadRequestError("MAILJET_API_KEY and/or MAILJET_API_SECRET are not defined in the environment variables.");
}

const mailjetClient = mailjet.apiConnect(mailjetApiKey, mailjetApiSecret);

const sendEmail = async ({
  toEmail,
  subject,
  textContent = "",
  htmlContent = "",
}: SendEmailParams): Promise<any> => {
  try {
    const request = mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL || "",
            Name: "Book Talk",
          },
          To: [
            {
              Email: toEmail,
            },
          ],
          Subject: subject,
          TextPart: textContent,
          HTMLPart: htmlContent,
        },
      ],
    });

    const result = await request;
    return result.body;
  } catch (error) {
    throw new Error("Failed to send email");
  }
};

export { sendEmail };
