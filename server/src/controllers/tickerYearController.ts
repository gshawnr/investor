import { Request, Response, NextFunction } from "express";
import MetricService from "../services/MetricService";
import { IMetric } from "../types/IMetric";
import { RequestWithPagination } from "../middleware/queryParser";
import { ITickerYear } from "../types/ITickerYear";
import TickerYearService from "../services/TickerYearService";

export const getTickerYearsAndData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pagination } = req as RequestWithPagination<ITickerYear>;
    const { filter, options } = pagination || {};

    const data = await TickerYearService.getDataByTickerYears({
      filter,
      options,
    });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export default { getTickerYearsAndData };
