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
 *     tags: [Discussions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Discussion'
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
 *                 discussionId:
 *                   type: string
 *                   example: "60b4bca4f1c64f16d1c1c8e4"
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateJWT, createDiscussion);

/**
 * @swagger
 * /api/v1/discussions/{discussionId}:
 *   delete:
 *     summary: Delete a discussion by ID
 *     tags: [Discussions]
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the discussion to delete
 *     responses:
 *       200:
 *         description: Discussion deleted successfully
 *       404:
 *         description: Discussion not found
 *       500:
 *         description: Internal server error
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the discussion (optional)
 *               content:
 *                 type: string
 *                 description: The content of the discussion (optional)
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the discussion (optional)
 *               meetingLink:
 *                 type: string
 *                 description: The meeting link for the discussion (optional)
 *             example:
 *               title: "Updated Discussion Title"
 *               content: "Updated content for the discussion"
 *               date: "2024-12-03T10:00:00Z"
 *               meetingLink: "https://example.com/meeting-link"
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
