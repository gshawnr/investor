import { Request, Response, NextFunction } from "express";
import StatementFetchService from "../services/StatementFetchService";
import ProfileService from "../services/ProfileService";

const BATCH_SIZE = 35;

const allStatementsFetch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tickers, period = "annual", limit = "10" } = req.query;

    let tickerArr: any[] = [];
    if (!tickers) {
      // Fetch all tickers from ProfileService in batches
      tickerArr = await ProfileService.getTickers();
    } else {
      tickerArr = (tickers as string).split(",").map((ticker) => ({ ticker }));
    }

    // Immediately respond to client
    res.status(202).json({
      message:
        "Request accepted. Statements will be fetched in the background.",
    });

    // Continue processing in the background
    (async () => {
      const results: any[] = [];
      const errors: any[] = [];

      // Helper function for delay
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      for (let i = 0; i < tickerArr.length; i += BATCH_SIZE) {
        const batch = tickerArr.slice(i, i + BATCH_SIZE);

        // For each ticker in the batch, fetch all statements in parallel
        const batchPromises = batch.map(async (obj) => {
          try {
            const { ticker: t } = obj;

            const [balanceSheet, incomeStatement, cashflowStatement, price] =
              await Promise.all([
                StatementFetchService.fetchBalanceSheets({
                  ticker: t,
                  period,
                  limit,
                }),
                StatementFetchService.fetchIncomeStatements({
                  ticker: t,
                  period,
                  limit,
                }),
                StatementFetchService.fetchCashflowStatements({
                  ticker: t,
                  period,
                  limit,
                }),
                StatementFetchService.fetchPriceByTicker({
                  ticker: t,
                  from: `${new Date().getFullYear() - 11}-01-01`,
                  to: `${new Date().getFullYear()}-01-31`,
                }),
              ]);

            return {
              ticker: t,
              balanceSheet,
              incomeStatement,
              cashflowStatement,
              price,
            };
          } catch (err) {
            errors.push({ ticker: obj.ticker, error: err });
            return null;
          }
        });

        // Wait for the batch to finish
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter(Boolean));

        // Add delay after each batch
        await delay(30000); // delay for provider
      }

      // Optionally: store results/errors somewhere, or trigger a notification
      // e.g., save to DB, send email, etc.
      // console.log({ results, errors });
    })();

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

const cashflowFetch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, period = "annual", limit = "10" } = req.query;

    const result = await StatementFetchService.fetchCashflowStatements({
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

const priceFetchByTicker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, from, to } = req.query;
    const currentYear = new Date().getFullYear();

    const fromDate: string =
      typeof from === "string" && from ? from : `${currentYear - 11}-01-01`;

    const toDate: string =
      typeof to === "string" && to ? to : `${currentYear - 1}-12-31`;

    const result = await StatementFetchService.fetchPriceByTicker({
      ticker,
      from: fromDate,
      to: toDate,
    });

    res.status(201).json(result);
    return;
  } catch (err) {
    next(err);
  }
};

const updatePriceByTicker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, from, to } = req.query;
    const currentYear = new Date().getFullYear();

    // if from & to not provided, default to current year
    const fromDate: string =
      typeof from === "string" && from ? from : `${currentYear}-01-01`;

    const toDate: string =
      typeof to === "string" && to ? to : `${currentYear}-12-31`;

    const result = await StatementFetchService.updatePriceByTicker({
      ticker,
      from: fromDate,
      to: toDate,
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
  cashflowFetch,
  priceFetchByTicker,
  updatePriceByTicker,
};
