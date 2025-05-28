import { Request, Response, NextFunction } from "express";
import MetricService from "../services/MetricService";

export const createMetric = async (
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

    let validatedFiscalYear: string | undefined;
    if (fiscal_year && typeof fiscal_year === "string") {
      const isValidYear = /^\d{4}$/.test(fiscal_year);
      if (isValidYear) validatedFiscalYear = fiscal_year;
    }

    MetricService.createMetric(validatedTicker, validatedFiscalYear);

    res.status(201).json({ message: "Metric creation initiated." });
  } catch (err) {
    next(err);
  }
};

export default { createMetric };
