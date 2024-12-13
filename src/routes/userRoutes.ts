import express, { Request, Response, Router } from "express";
import { register, login, getUserProfile, updateUserProfile, resetPassword, requestPasswordReset } from "../controllers/userController";
import authenticateJWT from "../middleware/authentication";


// Create an instance of the express router
const router: Router = express.Router();

/**
 * @swagger
 * components:
  *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60b4bca4f1c64f16d1c1c8e4"
 *         name:
 *           type: string
 *           description: User's name
 *           example: John
 *         email:
 *           type: string
 *           description: User's email address
 *           example: john@gmail.com
 *         password:
 *            type: string
 *            example: password123
 *         role:
 *           type: string
 *           description: User's role (either 'user' or 'admin')
 *           enum:
 *             - user
 *             - admin
 *           example: user
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string, example: john }
 *               email: { type: string, example: john@gmail.com }
 *               password: { type: string, example: password123 }
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, missing fields
 *       401:
 *         description: Conflict, user already exists
 */


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: 
 *                 type: string
 *                 example: john@gmail.com
 *               password: 
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: john
 *                 token:
 *                   type: string
 *                   example: "my_token"
 *       400:
 *         description: Bad request, missing fields
 *       401:
 *         description: Unauthorized, invalid email or password
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get the profile of the existing user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: token 
 *     parameters:
 *       - name: email
 *         in: query
 *         description: The email address of the user to retrieve (optional if authenticated).
 *         required: false
 *         schema:
 *           type: string
 *           example: john@gmail.com
 *     responses:
 *       200:
 *         description: Profile has been found
 *         content:
 *           application/json:
  *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, missing email field
 *       401:
 *         description: Unauthorized, user is not authorized
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/profile:
 *   post:
 *     summary: Update profile an existing user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: token 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: 
 *                 type: string
 *                 example: john
 *               email: 
 *                 type: string
 *                 example: john@gmail.com
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User has been updated"
 *       400:
 *         description: Bad request, missing fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/request:
 *   post:
 *     summary: Request a password reset link via email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user requesting a password reset.
 *                 example: "john@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent successfully to the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset link sent to email"
 *       400:
 *         description: Bad request, invalid or missing email field.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email address"
 *       404:
 *         description: Not found, user with the provided email doesn't exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User with this email does not exist"
 *       500:
 *         description: Internal server error, failed to send email or unexpected error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to send email"
 */


/**
 * @swagger
 * /api/v1/auth/reset:
 *   post:
 *     summary: Reset user password using a reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: The password reset token received by the user.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzYxYWIyYi1lM2YyLTQwZjgtYjJhMi1hYmZkMzI0YWIwY2YiLCJpYXQiOjE2NTg1NjUyMDB9.nrfEofw68HmnEXe9X7eIzrY9pPrf7ThpCxntnRdcxzy0"
 *               newPassword:
 *                 type: string
 *                 description: The new password to set for the user.
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password has been reset successfully"
 *       400:
 *         description: Bad request, missing or invalid fields (e.g. token or new password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token and new password are required"
 *       401:
 *         description: Unauthorized, invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired token"
 *       404:
 *         description: Not found, user not found or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while processing the password reset request"
 */

// User registration route
router.post("/register", register);

// User login route
router.post("/login", login);

router.post("/request", requestPasswordReset);

router.post("/reset", resetPassword);

//Get user profile route
router.get("/profile", authenticateJWT, getUserProfile);

//Update user profile route
router.post("/profile/", authenticateJWT, updateUserProfile);



export default router;
