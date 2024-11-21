import { Request, Response, NextFunction } from "express";
import CustomAPIError from "../errors/custom-api"; 
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose"; 

interface CustomError {
  statusCode: number;
  msg: string;
}

interface MongoErrorWithKeyValue extends mongoose.mongo.MongoError {
  keyValue: { [key: string]: any };
}

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let customError: CustomError = {
    statusCode: (err as any).statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:
      (err as any).message || "Something went wrong. Please try again later.",
  };


  if (err instanceof mongoose.Error.ValidationError) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    res.status(customError.statusCode).json({ msg: customError.msg });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `Invalid value for ${err.path}: ${err.value}`;
    res.status(customError.statusCode).json({ msg: customError.msg });
    return;
  }

  if (err instanceof mongoose.mongo.MongoError && err.code === 11000) {

    const mongoError = err as MongoErrorWithKeyValue;
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `Duplicate field value entered for ${Object.keys(
      mongoError.keyValue
    ).join(", ")}`;
    res.status(customError.statusCode).json({ msg: customError.msg });
    return;
  }

  if (err instanceof CustomAPIError) {
    customError.msg = err.message;
    customError.statusCode = err.statusCode;
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  res.status(customError.statusCode).json({ msg: customError.msg });
};


