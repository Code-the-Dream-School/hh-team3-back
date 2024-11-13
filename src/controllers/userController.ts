import { Request, Response } from "express";

const mainController = {
  get: (req: Request, res: Response): Response => {
    return res.json({
      data: "This is a full stack app!",
    });
  },
};

export default mainController;
