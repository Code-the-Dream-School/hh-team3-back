import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomAPIError, UnauthenticatedError } from "../errors";
import { IUser } from "../models/User";

const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new UnauthenticatedError("Authentication token missing or invalid")
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new CustomAPIError("Authentication token missing", 401));
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!payload.userId) {
      return next(new UnauthenticatedError("Invalid token"));
    }

    req.user = {
      userId: payload.userId
    } as unknown as IUser;

    next(); 
  } catch (error) {
    return next(new UnauthenticatedError("Authentication invalid"));
  }
};

export default authenticateJWT;
