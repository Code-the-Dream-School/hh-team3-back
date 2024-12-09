import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors";
import { UpdateContent, IUser } from "../interfaces/userInterfaces";


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

  const user: IUser | undefined = req.user;

  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  try {

    const { email } = req.body;

    if (!email) {
      return next(new BadRequestError("Please provide the email!"));
    }

    const userProfile = await User.findOne({ "email": email });

    if (!userProfile) {
      return next(new NotFoundError("The user with such email was not found"));
    }

    res.status(StatusCodes.OK).json({ name: userProfile.name, email: userProfile.email, id: userProfile._id });
  } catch (error) {
    return next(error);
  }

};

const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  //password could be added later if we'll decide to provide this option to the user
  const { body: { name, email }, params: { id: userIdToBeUpdated } } = req;

  const user: IUser | undefined = req.user;

  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  //depending on the Front we can change the approach and compare by e.g. email
  if (user.userId.toString() !== userIdToBeUpdated) {
    return next(new UnauthenticatedError("You aren't authorized to update this user"))
  }

  try {
    let updateContent: UpdateContent = {};

    if ((!name && !email) || (name === "" && email === "")) {
      return next(new BadRequestError("Please provide valid content for update"));
    }

    updateContent.name = name || user.name;
    updateContent.email = email || user.email;

    const updatedUser = await User.findByIdAndUpdate(userIdToBeUpdated, updateContent, { new: true, runValidators: true });

    res.status(StatusCodes.OK).json({ message: "User has been updated" });
  } catch (error) {
    return next(error);
  }

};

export { register, login, getUserProfile, updateUserProfile };
