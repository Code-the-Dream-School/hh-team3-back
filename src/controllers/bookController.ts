import { NextFunction, Request, Response } from "express";
import Book, { IBook } from "../models/Book";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import Joi from "joi";

const bookJoiSchema = Joi.object({
  title: Joi.string().required(),
  googleID: Joi.string().optional(),
  link: Joi.string().uri().optional(),
  authors: Joi.array().items(Joi.string().min(1)).required(),
  publisher: Joi.string().min(1).required(),
  description: Joi.string().required(),
  publishedDate: Joi.date().iso().required(),
  categories: Joi.array().items(Joi.string().required()),
  imageLinks: Joi.object({
    smallThumbnail: Joi.string().uri().optional(),
    thumbnail: Joi.string().uri().optional(),
  }).optional(),
});

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

  if (search) {
    query.title = { $regex: new RegExp(search, "i") };
  }


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

const createBook = async (req: Request<{}, {}, IBook>, res: Response, next: NextFunction) => {
 const { googleID, categories } = req.body;

  const { error } = bookJoiSchema.validate(req.body);
  if (error) {
   try {
     return next(new BadRequestError(error.details[0].message));
   } catch {
     return next(new BadRequestError("Failed to create a new book"));
   }
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

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Book.distinct("categories");
    const cleanedCategories = categories.map((category: string) => {
      return category.split("/")[0].trim();
    });

    const uniqueCategories = [...new Set(cleanedCategories)];

    res.status(StatusCodes.OK).json({ categories: uniqueCategories });
  } catch (error: unknown) {
    return next(error);
  }
};


export { getAllBooks, getBook, createBook, deleteBook, getAllCategories};
