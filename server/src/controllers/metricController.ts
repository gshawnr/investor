import { Request, Response, NextFunction } from "express";
import MetricService from "../services/MetricService";
import { IMetric } from "../types/IMetric";
import { RequestWithPagination } from "../middleware/queryParser";

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

export const getMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pagination } = req as RequestWithPagination<IMetric>;
    const { filter, options } = pagination || {};

    const metrics = await MetricService.getMetrics({ filter, options });
    res.status(200).json(metrics);
  } catch (err) {
    next(err);
  }
};

export default { createMetric, getMetrics };
