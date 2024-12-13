import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors";
import { UpdateContent } from "../interfaces/userInterfaces";
import { loginJoiSchema, registerJoiSchema, updateUserProfileJoiSchema } from "../validations/userValidation";


const register = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = registerJoiSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const {email} = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return next(new UnauthenticatedError("User with this email already exist"));
  }

  try {
    const user = await User.create({
      ...req.body,
      role: req.body.role || "user",
    });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};



const login = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginJoiSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const { email, password } = req.body;
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
    
    const email = req.query.email as string;
    console.log("Query email:", email);
    console.log("Query email type:", typeof(email));
    
    let userProfile;
    
    if (email) {      
      userProfile = await User.findOne({ "email": email });
    } else {
      userProfile = await User.findOne({ "_id": user.userId });
    }
        
    if (!userProfile) {
      return next(new NotFoundError("The user was not found"));
    }


    res
      .status(StatusCodes.OK)
      .json({
        name: userProfile.name,
        email: userProfile.email,
        id: userProfile._id,
        role: userProfile.role,
      });
  } catch (error) {
    return next(error);
  }

};

const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateUserProfileJoiSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const { name, email, role } = req.body;

  const user: IUser | undefined = req.user;

  if (!user) {
    return next(new UnauthenticatedError("User is not authenticated"));
  }

  try {
    let updateContent: UpdateContent = {};
    updateContent.name = name || user.name;
    updateContent.email = email || user.email;
    updateContent.role = role || user.role;

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      updateContent,
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({ message: "User has been updated" });
  } catch (error) {
    return next(error);
  }
};

export { register, login, getUserProfile, updateUserProfile };
