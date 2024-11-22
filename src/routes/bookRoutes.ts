import { Router } from "express";
import {
  getAllBooks,
  getBook,
  createBook,
  deleteBook,
} from "../controllers/bookController";

// Create a router instance
const router = Router();

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term to filter books by title (case-insensitive)
 *       - in: query
 *         name: categories
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of categories to filter books
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [a-z, z-a, latest, oldest]
 *         description: Sort the books by title (a-z, z-a) or by published date (latest, oldest)
 *     responses:
 *       200:
 *         description: A list of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, example: "60b4bca4f1c64f16d1c1c8e4" }
 *                       title: { type: string, example: "The Great Gatsby" }
 *                       authors: { type: array, items: { type: string }, example: ["F. Scott Fitzgerald"] }
 *                       publisher: { type: string, example: "Charles Scribner's Sons" }
 *                       description: { type: string, example: "A novel about the American Dream" }
 *                       publishedDate: { type: string, format: date, example: "1925-04-10" }
 *                       categories: { type: array, items: { type: string }, example: ["Fiction"] }
 *                       imageLinks:
 *                         type: object
 *                         properties:
 *                           smallThumbnail: { type: string, example: "https://link-to-image" }
 *                           thumbnail: { type: string, example: "https://link-to-thumbnail" }
 *                 count: { type: integer, example: 100 }
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllBooks);

// Create a new book
/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "1984" }
 *               authors: { type: array, items: { type: string }, example: ["George Orwell"] }
 *               publisher: { type: string, example: "Secker & Warburg" }
 *               description: { type: string, example: "A dystopian novel" }
 *               publishedDate: { type: string, format: date, example: "1949-06-08" }
 *               categories: { type: array, items: { type: string }, example: ["Dystopian"] }
 *               imageLinks:
 *                 type: object
 *                 properties:
 *                   smallThumbnail: { type: string, example: "https://link-to-small-thumbnail" }
 *                   thumbnail: { type: string, example: "https://link-to-thumbnail" }
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Book created successfully" }
 *                 bookId: { type: string, example: "60b4bca4f1c64f16d1c1c8e4" }
 *       400:
 *         description: Bad request, invalid input data
 *       500:
 *         description: Internal server error
 */
router.post("/", createBook);

// Get a single book by ID
/**
 * @swagger
 * /api/v1/books/{bookId}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to retrieve
 *     responses:
 *       200:
 *         description: A single book object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string, example: "60b4bca4f1c64f16d1c1c8e4" }
 *                 title: { type: string, example: "The Great Gatsby" }
 *                 authors: { type: array, items: { type: string }, example: ["F. Scott Fitzgerald"] }
 *                 publisher: { type: string, example: "Charles Scribner's Sons" }
 *                 description: { type: string, example: "A novel about the American Dream" }
 *                 publishedDate: { type: string, format: date, example: "1925-04-10" }
 *                 categories: { type: array, items: { type: string }, example: ["Fiction"] }
 *                 imageLinks:
 *                   type: object
 *                   properties:
 *                     smallThumbnail: { type: string, example: "https://link-to-image" }
 *                     thumbnail: { type: string, example: "https://link-to-thumbnail" }
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get("/:bookId", getBook);

// Delete a book by ID
/**
 * @swagger
 * /api/v1/books/{bookId}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Book deleted successfully" }
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:bookId", deleteBook);
export default router;
