import express, { Request, Response, Router } from "express";
import { register, login } from "../controllers/userController";

// Create an instance of the express router
const router: Router = express.Router();

/**
 * @swagger
 * /api/auth/register:
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
 *                 token: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzUxMDM2MWU5MDAwNDY2NmJmYTBhM2IiLCJuYW1lIjoiamFuZSIsImlhdCI6MTczMzM2MjUyOSwiZXhwIjoxNzM1OTU0NTI5fQ.1Uu8AGnH6LSHAahDvcVnJiJX6ZVBIe1ZzKvFjwTzDts" }
 *       400:
 *         description: Bad request, missing fields
 *       401:
 *         description: Conflict, user already exists
 */


/**
 * @swagger
 * /api/auth/login:
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
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzRmNmNiMWI4MGY1ZjIzMmJkNDMwNDciLCJuYW1lIjoibGFuYTEiLCJpYXQiOjE3MzMzNjMwOTAsImV4cCI6MTczNTk1NTA5MH0.1SdPRdehraC52kgtw5c1dtHuYGgTjn1TTzGlKa3nCzc"
 *       400:
 *         description: Bad request, missing fields
 *       401:
 *         description: Unauthorized, invalid email or password
 *       500:
 *         description: Internal server error
 */


// User registration route
router.post("/register", register);

// User login route
router.post("/login", login);

export default router;
