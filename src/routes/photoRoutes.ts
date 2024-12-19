import { Router } from "express";
import multer from "multer";
import authenticateJWT from "../middleware/authentication";         
import {
  deleteAvatarController,
  deleteBookCoverController, 
  uploadBookCoverController,
  uploadUserAvatarController,
} from "../controllers/photoController";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

/**
 * @swagger
 * /api/v1/photo/avatar:
 *   post:
 *     summary: Upload an avatar for the authenticated user
 *     tags: [Photo]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         required: true
 *         type: file
 *         description: The image file to upload, either as an avatar or book cover.
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Avatar uploaded successfully!"
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/uploaded-photo.jpg"
 *                 optimizedUrl:
 *                   type: string
 *                   example: "https://example.com/optimized-photo.jpg"
 *                 autoCroppedUrl:
 *                   type: string
 *                   example: "https://example.com/autocropped-photo.jpg"
 *       400:
 *         description: Bad request (missing or invalid parameters).
 *       401:
 *         description: User is not authenticated.
 *       404:
 *         description: User or book not found.
 *       500:
 *         description: Internal server error during image upload.
 */


router.post(
  "/avatar",
  authenticateJWT,
  upload.single("file"),
  uploadUserAvatarController
);

/**
 * @swagger
 * /api/v1/photo/cover:
 *   post:
 *     summary: Upload a book cover image for the authenticated user
 *     tags: [Photo]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         required: true
 *         type: file
 *         description: The image file to upload as the book cover.
 *       - in: formData
 *         name: bookId
 *         required: true
 *         type: string
 *         description: The ID of the book for which the cover is being uploaded.
 *     responses:
 *       200:
 *         description: Book cover uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book cover uploaded successfully!"
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/uploaded-cover.jpg"
 *                 optimizedUrl:
 *                   type: string
 *                   example: "https://example.com/optimized-cover.jpg"
 *                 autoCroppedUrl:
 *                   type: string
 *                   example: "https://example.com/autocropped-cover.jpg"
 *       400:
 *         description: Bad request, missing or invalid parameters (e.g., file or bookId).
 *       401:
 *         description: User is not authenticated.
 *       404:
 *         description: Book not found for the given bookId.
 *       500:
 *         description: Internal server error during book cover upload.
 */

router.post(
  "/cover",
  authenticateJWT,
  upload.single("file"),
  uploadBookCoverController
);

/**
 * @swagger
 * /api/v1/photo/avatar:
 *   delete:
 *     summary: Delete the avatar photo for the authenticated user
 *     tags: [Photo]
 *     responses:
 *       200:
 *         description: Photo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Photo deleted successfully!"
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
 *       404:
 *         description: User not found or no photo to delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The user was not found" 
 *                 or:
 *                   type: string
 *                   example: "No photo to delete"
 *       500:
 *         description: Error deleting the avatar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting avatar"
 */

router.delete("/avatar", authenticateJWT, deleteAvatarController);

/**
 * @swagger
 * /api/v1/photo/cover:
 *   delete:
 *     summary: Remove the cover photo of a specified book
 *     tags: [Photo]
 *     parameters:
 *       - in: body
 *         name: bookId
 *         required: true
 *         description: The unique ID of the book whose cover photo is to be deleted.
 *         schema:
 *           type: object
 *           properties:
 *             bookId:
 *               type: string
 *               example: "60b8f87b65e5f3b2b85e85f9"
 *     responses:
 *       200:
 *         description: Successfully deleted the book cover
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book cover deleted successfully!"
 *       400:
 *         description: Invalid request due to missing or incorrect parameters (e.g., bookId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book ID is required"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is not authenticated"
 *       404:
 *         description: Book not found or no cover exists for deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not found"
 *                 or:
 *                   type: string
 *                   example: "No cover to delete"
 *       500:
 *         description: Internal server error during cover deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting book cover"
 */

router.delete("/cover/:bookId", authenticateJWT, deleteBookCoverController);

export default router;
