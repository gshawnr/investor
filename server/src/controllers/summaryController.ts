import { Request, Response, NextFunction } from "express";
import SummaryService from "../services/SummaryService";

export const createSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, fiscal_year } = req.body;

    let validatedTicker: string | undefined;
    if (ticker && typeof ticker === "string") {
      validatedTicker = ticker.toLowerCase();
    }

    let validatedYear: string | undefined;
    if (fiscal_year && typeof fiscal_year === "string") {
      const isValidYear = /^\d{4}$/.test(fiscal_year);
      if (isValidYear) validatedYear = fiscal_year;
    }

    SummaryService.createSummaries(validatedTicker, validatedYear);

    res.status(201).json({ message: "Summary creation initiated." });
  } catch (err) {
    next(err);
  }
};

export default { createSummary };
