import { Router, Request, Response } from "express";
import BalanceSheet from "../models/BalanceSheet";

// Create a new balance sheet entry
const createBalanceSheet = async (req: Request, res: Response) => {
  try {
    const { ticker, fiscalYear, raw } = req.body;
    const tickerYear = `${ticker}_${fiscalYear.slice(0, 4)}`; // Concatenate ticker and year

    const newBalanceSheet = new BalanceSheet({
      ticker,
      fiscalYear,
      tickerYear,
      raw,
    });

    await newBalanceSheet.save();
    res.status(201).json(newBalanceSheet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all balance sheet entries
const getAllBalanceSheets = async (req: Request, res: Response) => {
  try {
    const balanceSheets = await BalanceSheet.find();
    res.status(200).json(balanceSheets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific balance sheet entry by ticker and fiscal year
const getBalanceSheetByTickerYear = async (req: Request, res: Response) => {
  try {
    const { tickerYear } = req.params;
    const balanceSheet = await BalanceSheet.findOne({ tickerYear });

    if (!balanceSheet) {
      return res.status(404).json({ message: "Balance sheet not found" });
    }

    res.status(200).json(balanceSheet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a specific balance sheet entry
const updateBalanceSheet = async (req: Request, res: Response) => {
  try {
    const { tickerYear } = req.params;
    const { ticker, fiscalYear, raw } = req.body;

    const updatedBalanceSheet = await BalanceSheet.findOneAndUpdate(
      { tickerYear },
      {
        ticker,
        fiscalYear,
        raw,
        tickerYear: `${ticker}_${fiscalYear.slice(0, 4)}`,
      },
      { new: true }
    );

    if (!updatedBalanceSheet) {
      return res.status(404).json({ message: "Balance sheet not found" });
    }

    res.status(200).json(updatedBalanceSheet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a balance sheet entry
const deleteBalanceSheet = async (req: Request, res: Response) => {
  try {
    const { tickerYear } = req.params;

    const deletedBalanceSheet = await BalanceSheet.findOneAndDelete({
      tickerYear,
    });

    if (!deletedBalanceSheet) {
      return res.status(404).json({ message: "Balance sheet not found" });
    }

    res.status(200).json({ message: "Balance sheet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Initialize Router
const router = Router();

// Define routes
router.post("/balance-sheets", createBalanceSheet);
router.get("/balance-sheets", getAllBalanceSheets);
router.get("/balance-sheets/:tickerYear", getBalanceSheetByTickerYear);
router.put("/balance-sheets/:tickerYear", updateBalanceSheet);
router.delete("/balance-sheets/:tickerYear", deleteBalanceSheet);

export default router;
