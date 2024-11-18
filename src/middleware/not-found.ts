import { Request, Response } from "express";

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).send({ message: "Not Found" });
};
