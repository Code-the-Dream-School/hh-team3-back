import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors";
import { UpdateContent } from "../interfaces/userInterfaces";
import { loginJoiSchema, registerJoiSchema, requestPasswordResetJoiSchema, resetPasswordJoiSchema, updateUserProfileJoiSchema } from "../validations/userValidation";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mailjetService";


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

const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { error } = requestPasswordResetJoiSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }
  
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new NotFoundError("User with this email does not exist"));
  }

  const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  user.passwordResetToken = resetToken;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {

    const htmlContent = `<p>We received a request to reset your password. To reset your password, click the link below:</p>
    <p><strong>Reset Password:</strong> <a href="${resetUrl}">Click to reset</a></p>
    <p>If you didn't request this, please ignore this email.</p>`;

    await sendEmail({
      toEmail: user.email,
      subject: `Your Password Reset Link`,
      htmlContent: htmlContent,
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "Password reset link sent to email" });
  } catch (error) {
    return next(new Error("Failed to send email"));
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = resetPasswordJoiSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return next(new BadRequestError("Token and new password are required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    if (user.passwordResetToken !== token) {
      return next(new BadRequestError("Invalid token"));
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    return next(new BadRequestError("Invalid or expired token"));
  }
};

export {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  requestPasswordReset,
  resetPassword
};
