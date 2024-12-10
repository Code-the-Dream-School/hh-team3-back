import { Router } from "express";
import {
  getAllDiscussions,
  getDiscussion,
  createDiscussion,
  deleteDiscussion,
  joinDiscussion,
  unjoinDiscussion,
  updateDiscussion,
} from "../controllers/discussionController";
import authenticateJWT from "../middleware/authentication";

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Discussion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60b4bca4f1c64f16d1c1c8e4"
 *         title:
 *           type: string
 *           example: "Book Club Meeting"
 *         book:
 *           type: string
 *           example: "60b4bca4f1c64f16d1c1c8e4"
 *         content:
 *           type: string
 *           example: "Discussion of chapter 1 of 'The Great Gatsby'"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2024-12-02T18:00:00Z"
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           example: ["60b4bca4f1c64f16d1c1c8e4", "60c5a8e7d9a5a142a02344b3"]
 *         meetingLink:
 *           type: string
 *           example: "https://meet.google.com/abc-xyz"
 *         createdBy:
 *           type: string
 *           format: uuid
 *           example: "60b4bca4f1c64f16d1c1c8e4"
 *   responses:
 *     DiscussionResponse:
 *       description: A single discussion object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Discussion'
 *     DiscussionListResponse:
 *       description: A list of discussions
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discussions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Discussion'
 *               count:
 *                 type: integer
 *                 example: 10
 */

/**
 * @swagger
 * /api/v1/discussions:
 *   get:
 *     summary: Retrieve all discussions
 *     tags: [Discussions]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter discussions by title
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [latest, oldest]
 *         description: Sort discussions by date (latest or oldest)
 *       - in: query
 *         name: bookId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter discussions by a specific bookId
 *       - in: query
 *         name: timePeriod
 *         required: false
 *         schema:
 *           type: string
 *           enum: [past, future]
 *         description: Filter discussions by time period (past or future). 
 *     responses:
 *       200:
 *         description: A list of discussions with the count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 discussions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Discussion'
 *                 count:
 *                   type: integer
 *                   description: The total number of discussions
 *       500:
 *         description: Internal server error
 */

router.get("/", getAllDiscussions);

/**
 * @swagger
 * /api/v1/discussions/{discussionId}:
 *   get:
 *     summary: Retrieve a single discussion by ID
 *     tags: [Discussions]
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the discussion to retrieve
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DiscussionResponse'
 *       404:
 *         description: Discussion not found
 *       500:
 *         description: Internal server error
 */
router.get("/:discussionId", getDiscussion);

/**
 * @swagger
 * /api/v1/discussions:
 *   post:
 *     summary: Create a new discussion
 *     description: This endpoint allows an authenticated user to create a new discussion related to a specific book. The user must be logged in, and the input data will be validated before the discussion is created.
 *     tags: [Discussions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Discussion'
 *           examples:
 *             example-1:
 *               summary: Example of a discussion creation request
 *               value:
 *                 discussion:
 *                   title: "Discussion about The Great Gatsby19"
 *                   book: "6745045ab062cc87d005986d"  # Book ID
 *                   content: "In this discussion, we’ll explore the themes of wealth, class, and the American Dream in *The Great Gatsby* by F. Scott Fitzgerald."
 *                   date: "2024-12-01T00:00:00.000Z"
 *                   participants: []  # Empty list, can be updated later with participants
 *                   meetingLink: "https://zoom.us/j/1234567890"
 *     responses:
 *       201:
 *         description: Discussion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discussion created successfully"
 *                 discussion:
 *                   $ref: '#/components/schemas/Discussion'
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


router.post("/", authenticateJWT, createDiscussion);

/**
 * @swagger
 * /api/v1/discussions/{discussionId}:
 *   delete:
 *     summary: Delete a discussion by its ID
 *     tags: [Discussions]
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the discussion to be deleted
 *     responses:
 *       200:
 *         description: The discussion was deleted successfully
 *       400:
 *         description: Invalid input or bad request (e.g., invalid discussion ID)
 *       401:
 *         description: Unauthorized access (user not authenticated or not authorized to delete the discussion)
 *       404:
 *         description: Discussion not found with the specified ID
 *       500:
 *         description: Internal server error occurred during deletion process
 */

router.delete("/:discussionId", authenticateJWT, deleteDiscussion);

/**
 * /**
 * @swagger
 * /api/v1/discussions/{discussionId}:
 *   patch:
 *     summary: Update an existing discussion with optional fields
 *     tags: [Discussions]
 *     parameters:
 *       - name: discussionId
 *         in: path
 *         required: true
 *         description: The ID of the discussion to update
 *         schema:
 *           type: string
 *           example: "60b4bca4f1c64f16d1c1c8e4"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Discussion'
 *     responses:
 *       200:
 *         description: Discussion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discussion updated successfully"
 *                 discussion:
 *                   $ref: '#/components/schemas/Discussion'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Discussion not found
 *       500:
 *         description: Internal server error
 */

router.patch("/:discussionId", authenticateJWT, updateDiscussion);

/**
 * @swagger
 * /api/v1/discussions/{discussionId}/join:
 *   post:
 *     summary: Join an ongoing discussion
 *     tags: [Discussions]
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the discussion to join
 *     responses:
 *       200:
 *         description: Successfully join the discussion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discussion'
 *       400:
 *         description: User already a participant in this discussion
 *       404:
 *         description: Discussion not found
 *       500:
 *         description: Internal server error
 */

router.post("/:discussionId/join", authenticateJWT, joinDiscussion);

/**
 * @swagger
 * /api/v1/discussions/{discussionId}/unjoin:
 *   post:
 *     summary: Leave an ongoing discussion
 *     tags: [Discussions]
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the discussion to leave
 *     responses:
 *       200:
 *         description: Successfully left the discussion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discussion'
 *       400:
 *         description: User is not a participant in this discussion
 *       404:
 *         description: Discussion not found
 *       500:
 *         description: Internal server error
 */
router.post("/:discussionId/unjoin", authenticateJWT, unjoinDiscussion);

export default router;
