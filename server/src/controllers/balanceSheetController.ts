import { Request, Response, NextFunction } from "express";
import BalanceSheetService from "../services/BalanceSheetService";

const createBalanceSheet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await BalanceSheetService.createBalanceSheet(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getBalanceSheet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker } = req.params;
    const { fiscalYear } = req.query;

    if (fiscalYear) {
      const result = await BalanceSheetService.getBalanceSheetByTickerYear(
        ticker,
        fiscalYear as string
      );

      if (!result) {
        res.status(404).json({ message: "BalanceSheet not found" });
        return;
      }
      res.json(result);
      return;
    } else {
      const results = await BalanceSheetService.getBalanceSheetsByTicker(
        ticker
      );
      res.status(200).json(results);
      return;
    }
  } catch (err) {
    next(err);
  }
};

const updateBalanceSheet = async (
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
    const result = await BalanceSheetService.updateBalanceSheet(
      ticker,
      fiscalYear,
      updateData
    );
    if (!result) {
      res.status(404).json({ message: "BalanceSheet not found" });
      return;
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const deleteBalanceSheet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, fiscalYear } = req.params;
    const result = await BalanceSheetService.deleteBalanceSheet(
      ticker,
      fiscalYear
    );
    if (!result) {
      res.status(404).json({ message: "BalanceSheet not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default {
  createBalanceSheet,
  getBalanceSheet,
  updateBalanceSheet,
  deleteBalanceSheet,
};
