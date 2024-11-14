import { Request, Response } from "express";

const mainController = {
  get: (req: Request, res: Response): void => {
    res.json({
      data: "This is a full stack app!",
    });
  },
};

export default mainController;
