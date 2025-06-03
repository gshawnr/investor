import { Request, Response, NextFunction } from "express";
import TargetService from "../services/TargetService";
import { ITarget } from "../types/ITarget";
import { RequestWithPagination } from "../middleware/queryParser";

export const createTargets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    TargetService.createTarget();
    res.status(201).json({ message: "Targets creation initiated" });
  } catch (err) {
    next(err);
  }
};

export const getTargets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pagination } = req as RequestWithPagination<ITarget>;
    const { filter, options } = pagination || {};

    const targets = await TargetService.getTargets({ filter, options });
    res.status(200).json(targets);
  } catch (err) {
    next(err);
  }
};

export const deleteTargets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker_year } = req.query;

    if (ticker_year) {
      const regex = /^[A-Z]{1,5}_\d{4}$/i;

      if (!regex.test(ticker_year as string)) {
        res.status(400).json({ message: "invalid ticker_year provided" });
        return;
      }
      await TargetService.deleteTargets(ticker_year as string);
      res.status(204).json({ message: "success" });
      return;
    }

    await TargetService.deleteTargets();
    res.status(204).json({ message: "success" });
  } catch (err) {
    next(err);
  }
};

export default { createTargets, getTargets };
