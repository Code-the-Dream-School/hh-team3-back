import { Request, Response } from "express";
import User from "../models/User";

interface IUserRequestBody {
  email: string;
  password: string;
  name?: string;
}

const register = async (
  req: Request<{}, {}, IUserRequestBody>,
  res: Response
): Promise<void> => {};

const login = async (
  req: Request<{}, {}, IUserRequestBody>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
};

export { register, login };
