import { NextFunction, Request, Response } from "express";
import Book, { IBook } from "../models/Book";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import mongoose from "mongoose";

// Interface for query parameters
interface IGetBooksQuery {
  search?: string;
  categories?: string;
  sort?: "a-z" | "z-a" | "latest" | "oldest";
}

// Get all books
const getAllBooks = async (
  req: Request<{}, {}, {}, IGetBooksQuery>,
  res: Response,
  next: NextFunction
) => {
  const { search, categories, sort } = req.query;
  let query: any = {};

  // Filter by categories
   if (categories) {
     const categoryArray = Array.isArray(categories)
       ? categories
       : categories.split(",");

     query.categories = {
       $in: categoryArray.map((category: string) => {
         // Trim the category and extract the main category before the slash
         const [mainCategory] = category
           .split("/")
           .map((part: string) => part.trim());
         return new RegExp(`^${mainCategory}`);
       }),
     };
   }
   
  // Search by title
  if (search) {
    query.title = { $regex: new RegExp(search, "i") }; // Case-insensitive search
  }


  // Sort options
  const sortOptions: any = {};
  if (sort) {
    if (sort === "a-z") sortOptions.title = 1;
    else if (sort === "z-a") sortOptions.title = -1;
    else if (sort === "latest") sortOptions.publishedDate = -1;
    else if (sort === "oldest") sortOptions.publishedDate = 1;
  } else {
    sortOptions.publishedDate = -1; 
  }

  try {
    const books = await Book.find(query).sort(sortOptions);
    res.status(StatusCodes.OK).json({ books, count: books.length });
  } catch (error: unknown) {
    return next(error);
  }
};

// Get a single book by ID
const getBook = async (
  req: Request<{ bookId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { bookId } = req.params;
  try {    
    const book = await Book.findById(bookId);
    if (!book) {
      return next(new NotFoundError(`No book with id ${bookId}`));
    }
    res.status(StatusCodes.OK).json({ book });
  } catch (error: unknown) {
    return next(error);
  }
};

// Create a new book
const createBook = async (req: Request<{}, {}, IBook>, res: Response, next: NextFunction) => {
  const {
    title,
    googleID,
    authors,
    publisher,
    description,
    publishedDate,
    categories,
  } = req.body;

  if (!title) {
    return next(new BadRequestError("Title is required"));
  }
  if (!authors) {
    return next(new BadRequestError("Authors are required"));
  }
  if (!publisher) {
    return next(new BadRequestError("Publisher is required"));
  }
  if (!description) {
    return next(new BadRequestError("Description is required"));
  }
  if (!publishedDate) {
    return next(new BadRequestError("Published Date is required"));
  }

  // If googleID is provided, it should be unique
  if (googleID) {
    try {
      const existingBook = await Book.findOne({ googleID });

      if (existingBook) {
        return next(new BadRequestError("A book with this googleID already exists"));
      }
    } catch (error) {
      return next(error);
    }
  }

  if (categories && categories.length === 0) {
    return next(new BadRequestError("Categories cannot be an empty array"));
  }
 
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ book });
  } catch (error) {
    return next(error);
  }
};

// Delete a book by ID
const deleteBook = async (
  req: Request<{ bookId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      throw new NotFoundError(`No book with id ${bookId}`);
    }
    res.status(StatusCodes.OK).send();
  } catch (error: unknown) {
    return next(error);
  }
};

export { getAllBooks, getBook, createBook, deleteBook };
