import { Request, Response, NextFunction } from "express";
import StatementFetchService from "../services/StatementFetchService";

const allStatementsFetch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, ticker, period = "annual", limit = "10" } = req.query;

    const balanceSheetPromise = StatementFetchService.fetchBalanceSheets({
      ticker,
      period,
      limit,
    });

    // const incomeStatementPromise = StatementFetchService.fetchIncomeStatements({
    //   ticker,
    //   period,
    //   limit,
    // });

    // const cashFlowStatementPromise =
    //   StatementFetchService.fetchCashFlowStatements({
    //     ticker,
    //     period,
    //     limit,
    //   });

    // await Promise.all([
    //   balanceSheetPromise,
    //   incomeStatementPromise,
    //   cashFlowStatementPromise,
    // ]);

    res.status(201).json({ message: "Fetching all statements..." });
    return;
  } catch (err) {
    next(err);
  }
};

const balanceSheetFetch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, period = "annual", limit = "10" } = req.query;

    const result = await StatementFetchService.fetchBalanceSheets({
      ticker,
      period,
      limit,
    });
    res.status(201).json(result);
    return;
  } catch (err) {
    next(err);
  }
};

const incomeFetch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticker, period = "annual", limit = "10" } = req.query;

    const result = await StatementFetchService.fetchIncomeStatements({
      ticker,
      period,
      limit,
    });
    res.status(201).json(result);
    return;
  } catch (err) {
    next(err);
  }
};

export default {
  allStatementsFetch,
  balanceSheetFetch,
  incomeFetch,
  // updateBalanceSheet,
  // deleteBalanceSheet,
};
