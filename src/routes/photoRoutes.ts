import { Router } from "express";
import multer from "multer";
import authenticateJWT from "../middleware/authentication";         
import { deletePhotoController, uploadPhotoController } from "../controllers/photoController";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

/**
 * @swagger
 * /api/v1/users/photo:
 *   post:
 *     summary: Upload an avatar photo for the authenticated user
 *     tags: [Photo]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         required: true
 *         type: file
 *         description: The image file to upload as the user's avatar
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
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
 *         description: No file uploaded or invalid file format
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
 *         description: The user was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The user was not found"
 *       500:
 *         description: Error uploading avatar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error uploading avatar"
 */


router.post("/", authenticateJWT, upload.single("file"), uploadPhotoController);

/**
 * @swagger
 * /api/v1/users/photo:
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

router.delete("/", authenticateJWT, deletePhotoController);

export default router;
