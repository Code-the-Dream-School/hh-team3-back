import express, { Request, Response, Router } from "express";
import { register, login, getUserProfile, updateUserProfile } from "../controllers/userController";
import authenticateJWT from "../middleware/authentication";


// Create an instance of the express router
const router: Router = express.Router();

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
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name: { type: string, example: john }
 *                 token: { type: string, example: "my_token" }
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
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: john
 *                 email:
 *                   type: string
 *                   example: john@john.com
 *                 id:
 *                   type: string
 *                   example: 675332327a5f1dac22191c22
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: john
 *       400:
 *         description: Bad request, missing fields
 *       401:
 *         description: Unauthorized, user tries to update another user
 *       500:
 *         description: Internal server error
 */


// User registration route
router.post("/register", register);

// User login route
router.post("/login", login);

//Get user profile route
router.get("/profile", authenticateJWT, getUserProfile);

//Update user profile route
router.post("/profile/", authenticateJWT, updateUserProfile);



export default router;
