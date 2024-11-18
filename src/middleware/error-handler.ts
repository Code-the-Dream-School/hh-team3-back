import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

// Define a custom error type if needed
interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, { message: string }>;
  keyValue?: Record<string, any>;
  value?: string;
}

export const errorHandlerMiddleware = (
  err: CustomError, // Ensure this is typed as a CustomError
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors!)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value!!! entered for ${Object.keys(
      err.keyValue!
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }

  res.status(customError.statusCode).json({ msg: customError.msg });
};
