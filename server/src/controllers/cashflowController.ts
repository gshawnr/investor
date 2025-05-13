import { Request, Response, NextFunction } from "express";
import CashFlowService from "../services/CashflowService";

const createCashFlow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CashFlowService.createCashFlow(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getCashFlow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticker } = req.params;
    const { year } = req.query;

    if (year) {
      const isValidYear = /^\d{4}$/.test(year as string);
      if (!isValidYear) {
        res.status(400).json({ message: "invalid year format" });
        return;
      }

      const result = await CashFlowService.getCashFlowByTickerYear(
        ticker,
        year as string
      );

      if (!result) {
        res.status(404).json({ message: "cashflow not found" });
        return;
      }
      res.status(200).json(result);
      return;
    } else {
      const results = await CashFlowService.getCashFlowsByTicker(ticker);
      res.status(200).json(results);
      return;
    }
  } catch (err) {
    next(err);
  }
};

const updateCashFlow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, year } = req.params;
    const updateData = { ...req.body };
    if (updateData._id) {
      delete updateData._id;
    }

    const isValidYear = /^\d{4}$/.test(year as string);
    if (!isValidYear) {
      res.status(400).json({ message: "invalid year format" });
      return;
    }

    const result = await CashFlowService.updateCashFlow(
      ticker,
      year,
      updateData
    );

    if (!result) {
      res.status(404).json({ message: "cashflow not found" });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteCashFlow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, year } = req.params;
    const result = await CashFlowService.deleteCashFlow(ticker, year);

    const isValidYear = /^\d{4}$/.test(year as string);
    if (!isValidYear) {
      res.status(400).json({ message: "invalid year format" });
      return;
    }

    if (!result) {
      res.status(404).json({ message: "CashFlow not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default {
  createCashFlow,
  getCashFlow,
  updateCashFlow,
  deleteCashFlow,
};
