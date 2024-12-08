import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors";


const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new BadRequestError("Please provide name, email and password"));
  }

  const user = await User.findOne({ email });

  if (user) {
    return next(new UnauthenticatedError("User with this email already exist"));
  }

  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};



const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Please provide email and password"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new UnauthenticatedError("Invalid Credentials"));
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new UnauthenticatedError("Invalid Credentials"));
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  
  //User Profile
  //???????? Allow users to view and track their reading progress.
  // Enable users to add and edit personal information.
  
  //verify the email existance
  if (!email) {
    return next(new BadRequestError("Please provide the email!"));
  }

  //request the profile from the DB
  const userProfile = await User.findOne({"email": email});

  //build the response
  if (!userProfile) {
    return next(new NotFoundError("The user with such email was not found"));
  }

  res.status(StatusCodes.OK).json({ name: userProfile.name, email: userProfile.email, id: userProfile._id });

};

const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email } = req.body;

  //User Profile
  // Allow users to view and track their reading progress.
  // Enable users to add and edit personal information.

  //verify the email existance

  //request the profile from the DB

  //update the profile

  //build the response
  res.status(StatusCodes.OK).json({ response: "OK" });

};

export { register, login, getUserProfile, updateUserProfile };
