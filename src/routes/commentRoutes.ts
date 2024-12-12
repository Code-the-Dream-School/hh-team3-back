import { Router } from "express";
import { createCommentToBook, getComments, deleteCommentToBook, likeCommentToBook } from "../controllers/commentController";
import authenticateJWT from "../middleware/authentication";

const router = Router();

/**
 * @swagger
 * /api/v1/comments:
 *   post:
 *     summary: Create a new comment on a book
 *     description: This endpoint allows an authenticated user to create a new comment on a specific book. The user must be logged in, and the input data will be validated before the comment is created.
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *           examples:
 *             example-1:
 *               summary: Example of a comment creation request
 *               value:
 *                 comment:
 *                   text: "This is a great analysis of the themes in *The Great Gatsby*! I agree that wealth plays a huge role in the story."
 *                   book: "6745045ab062cc87d005986d"  # Book ID (this should be the actual ID of the book)
 *                   user: "60dcbf9b8f3b2a001c8d5a4b"  # User ID of the comment's author (referencing an existing user)
 *                   likeCount: 0
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment created successfully"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input data or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       401:
 *         description: User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is not authenticated"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later."
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           example: "This is a great analysis of the themes in *The Great Gatsby*!"
 *         book:
 *           type: string
 *           description: "ID of the book the comment is related to"
 *           example: "6745045ab062cc87d005986d"
 *         user:
 *           type: string
 *           description: "ID of the user creating the comment"
 *           example: "60dcbf9b8f3b2a001c8d5a4b"
 *         likeCount:
 *           type: number
 *           description: "Number of likes the comment has received"
 *           example: 0
 *       required:
 *         - text
 *         - book
 *         - user
 */

router.post("/", authenticateJWT, createCommentToBook);


/**
 * @swagger
 * /api/v1/comments:
 *   get:
 *     summary: Retrieve comments (all or for a specific book)
 *     description: This endpoint retrieves a list of comments, optionally filtered by a specific book ID.
 *     parameters:
 *       - in: query
 *         name: bookId
 *         required: false
 *         schema:
 *           type: string
 *         description: The ID of the book for which the comments are being fetched.
 *     responses:
 *       200:
 *         description: Successfully retrieved the comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                   description: A list of comments related to the requested book.
 *                 count:
 *                   type: number
 *                   description: The total number of comments retrieved.
 *       400:
 *         description: Bad request, invalid query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid book ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *     tags:
 *       - Comments
 */


router.get("/", getComments);

/**
 * @swagger
 * /api/v1/comments/{commentId}:
 *   delete:
 *     summary: Delete the comment
 *     description: This endpoint removes the coment by a specific comment ID if it was created by the same user as a user from the request.
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment user wants to delete.
 *     responses:
 *       200:
 *         description: Comment was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment was successfully deleted"
 *       401:
 *         description: User requested the deletion is not the user created the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User is not authorized to delete this comment"
 *       404:
 *         description: Comment was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Comment was not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *     tags:
 *       - Comments
 */

router.delete("/:commentId", authenticateJWT, deleteCommentToBook);

/**
 * @swagger
 * /api/v1/comments/{commentId}/like:
 *   post:
 *     summary: Adds like to a comment
 *     description: This endpoint incements the likeCount of the comment by 1 by a specific comment ID.
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment user wants to like.
 *     responses:
 *       200:
 *         description: Comment was successfully liked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 commentId:
 *                   type: string
 *                   description: Comment id.
 *                 likeCount:
 *                   type: number
 *                   description: The total number of likes.
 *       404:
 *         description: Comment was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Comment was not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *     tags:
 *       - Comments
 */
router.post("/:commentId/like", authenticateJWT, likeCommentToBook);


export default router;
