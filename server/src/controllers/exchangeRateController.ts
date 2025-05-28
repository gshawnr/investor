import { Request, Response, NextFunction } from "express";
import ExchangeRateService from "../services/ExchangeRateService";
import { IExchangeRate } from "../types/IExchangeRate";

const createExchangeRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await ExchangeRateService.createExchangeRate(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getExchangeRates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currency, year } = req.query;
    const params: Partial<IExchangeRate> = {};

    if (currency || year) {
      if (currency) {
        const isValidCurrency = /^[A-Z]{3}$/.test(currency as string);
        if (!isValidCurrency) {
          res.status(400).json({ message: "invalid currency format" });
          return;
        }
        params.currency = currency as string;
      }

      if (year && typeof year === "string") {
        params.year = year;
      }

      const results = await ExchangeRateService.getExchangeRates(params);
      if (!results) {
        res.status(404).json({ message: "exchanges rate not found" });
        return;
      }
      res.status(200).json(results);
      return;
    } else {
      const results = await ExchangeRateService.getExchangeRates(params);
      res.status(200).json(results);
      return;
    }
  } catch (err) {
    next(err);
  }
};

const updateExchangeRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currency, year } = req.params;
    const updateData = { ...req.body };
    if (updateData._id) {
      delete updateData._id;
    }

    const isValidCurrency = /^[A-Z]{3}$/.test(currency as string);
    if (!isValidCurrency) {
      res.status(400).json({ message: "invalid currency format" });
      return;
    }

    const result = await ExchangeRateService.updateExchangeRate(
      currency,
      year,
      updateData
    );

    if (!result) {
      res.status(404).json({ message: "exchange rate not found" });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteExchangeRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currency, year } = req.params;

    const isValidCurrency = /^[A-Z]{3}$/.test(currency as string);
    if (!isValidCurrency) {
      res.status(400).json({ message: "invalid currency format" });
      return;
    }

    const result = await ExchangeRateService.deleteExchangeRate(currency, year);

    if (!result) {
      res.status(404).json({ message: "exchange rate not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default {
  createExchangeRate,
  getExchangeRates,
  updateExchangeRate,
  deleteExchangeRate,
};
