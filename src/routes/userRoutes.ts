import express, { Request, Response, Router } from "express";
import { register, login } from "../controllers/userController";

// Create an instance of the express router
const router: Router = express.Router();

// Swagger: User registration
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
 *                 message: { type: string, example: User registered successfully }
 *                 userId: { type: integer, example: 12345 }
 *       400: { description: Bad request, invalid input data }
 *       409: { description: Conflict, user already exists }
 */

/** */

router.post("/register", register);
router.post("/login", login);

export default router;
