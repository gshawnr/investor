import { Request, Response, NextFunction } from "express";
import CashflowService from "../services/CashflowService";

const createCashflow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CashflowService.createCashflow(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getCashflow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticker } = req.params;
    const { year } = req.query;

    if (year) {
      const isValidYear = /^\d{4}$/.test(year as string);
      if (!isValidYear) {
        res.status(400).json({ message: "invalid year format" });
        return;
      }

      const result = await CashflowService.getCashflowByTickerYear(
        ticker,
        year as string
      );

      if (!result) {
        res.status(404).json({ message: "Cashflow not found" });
        return;
      }
      res.status(200).json(result);
      return;
    } else {
      const results = await CashflowService.getCashflowsByTicker(ticker);
      res.status(200).json(results);
      return;
    }
  } catch (err) {
    next(err);
  }
};

const updateCashflow = async (
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

    const result = await CashflowService.updateCashflow(
      ticker,
      year,
      updateData
    );

    if (!result) {
      res.status(404).json({ message: "Cashflow not found" });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteCashflow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, year } = req.params;

    const isValidYear = /^\d{4}$/.test(year as string);
    if (!isValidYear) {
      res.status(400).json({ message: "invalid year format" });
      return;
    }

    const result = await CashflowService.deleteCashflow(ticker, year);

    if (!result) {
      res.status(404).json({ message: "Cashflow not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default {
  createCashflow,
  getCashflow,
  updateCashflow,
  deleteCashflow,
};
