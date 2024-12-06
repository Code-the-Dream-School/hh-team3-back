import express, { Request, Response } from "express";
import { sendEmailController } from "../controllers/emailController";

const router = express.Router();

/**
 * @swagger
 * /api/v1/email:
 *   post:
 *     summary: Send an email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toEmail:
 *                 type: string
 *                 description: The recipient's email address
 *                 example: "recipient@example.com"
 *               subject:
 *                 type: string
 *                 description: The subject of the email
 *                 example: "Join Our Exciting Book Discussion!"
 *               textContent:
 *                 type: string
 *                 description: The plain text content of the email
 *                 example: "Hi, we're excited to discuss this book with you!"
 *               htmlContent:
 *                 type: string
 *                 description: The HTML content of the email
 *                 example: "<h3>Hi, we're excited to discuss this book with you!</h3>"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email sent successfully"
 *                 data:
 *                   type: object
 *                   description: The result of the email sending process
 *       400:
 *         description: Invalid email data (e.g., missing required fields or invalid email format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email data"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to send email"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

router.post("/", sendEmailController);

export default router;
