import { Request, Response, NextFunction } from "express";
import CalculationConstants from "../services/CalculationConstantsService";
import CalculationConstantsService from "../services/CalculationConstantsService";

const createCalculationConstants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CalculationConstantsService.createCalculationConstants(
      req.body
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getCalculationConstants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year } = req.query;

    if (year) {
      const isValidYear = /^\d{4}$/.test(year as string);
      if (!isValidYear) {
        res.status(400).json({ message: "invalid year format" });
        return;
      }

      const result = await CalculationConstants.getCalculationConstants(
        year as string
      );

      if (!result) {
        res.status(404).json({ message: "calculation constants not found" });
        return;
      }
      res.status(200).json(result);
      return;
    } else {
      const results = await CalculationConstants.getAllCalculationConstants();
      res.status(200).json(results);
      return;
    }
  } catch (err) {
    next(err);
  }
};

const updateCalculationConstants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year } = req.params;
    const updateData = { ...req.body };
    if (updateData._id) {
      delete updateData._id;
    }

    const isValidYear = /^\d{4}$/.test(year as string);
    if (!isValidYear) {
      res.status(400).json({ message: "invalid year format" });
      return;
    }

    const result = await CalculationConstants.updateCalculationConstants(
      year,
      updateData
    );

    if (!result) {
      res.status(404).json({ message: "calculation constants not found" });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteCalculationConstants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year } = req.params;

    const isValidYear = /^\d{4}$/.test(year as string);
    if (!isValidYear) {
      res.status(400).json({ message: "invalid year format" });
      return;
    }

    const result = await CalculationConstants.deleteCalculationConstants(year);

    if (!result) {
      res.status(404).json({ message: "calculation constant not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default {
  createCalculationConstants,
  getCalculationConstants,
  updateCalculationConstants,
  deleteCalculationConstants,
};
