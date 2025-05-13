import { Request, Response, NextFunction } from "express";
import IncomeService from "../services/IncomeService";

const createIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await IncomeService.createIncome(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getIncome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticker } = req.params;
    const { year } = req.query;

    if (year) {
      const isValidYear = /^\d{4}$/.test(year as string);
      if (!isValidYear) {
        res.status(400).json({ message: "invalid year format" });
      }

      const income = await IncomeService.getIncomeByTickerYear(
        ticker,
        year as string
      );

      if (!income) {
        res.status(404).json({ message: "income not found" });
      }

      res.status(200).json(income);
      return;
    } else {
      const incomes = await IncomeService.getIncomeByTicker(ticker);
      res.status(200).json(incomes);
      return;
    }
  } catch (err) {
    next(err);
  }
};

const updateIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, fiscalYear } = req.params;
    const updateData = { ...req.body };
    if (updateData._id) {
      delete updateData._id;
    }

    const year = fiscalYear.trim().slice(0, 4);
    const updated = await IncomeService.updateIncome(ticker, year, updateData);

    if (!updated) {
      res.status(404).json({ message: "income not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteIncome = async (
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

    const result = await IncomeService.deleteIncome(ticker, year);
    if (!result) {
      res.status(404).json({ message: "income not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default {
  createIncome,
  getIncome,
  updateIncome,
  deleteIncome,
};
