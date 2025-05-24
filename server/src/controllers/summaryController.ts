import { Request, Response, NextFunction } from "express";
import SummaryService from "../services/SummaryService";

export const createSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, year } = req.body;

    let validatedTicker: string | undefined;
    if (ticker && typeof ticker === "string") {
      validatedTicker = ticker.toLowerCase();
    }

    let validatedYear: string | undefined;
    if (year && typeof year === "string") {
      const isValidYear = /^\d{4}$/.test(year);
      if (isValidYear) validatedYear = year;
    }

    SummaryService.createSummaries(validatedTicker, validatedYear);

    res.status(201).json({});
  } catch (err) {
    next(err);
  }
};

export default { createSummary };
