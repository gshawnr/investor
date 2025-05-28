import mongoose, { Schema } from "mongoose";
import { IBalanceSheet } from "../types/IBalanceSheet";

// Schema for the balance sheet
const balanceSheetSchema: Schema = new Schema(
  {
    ticker: {
      type: String,
      required: true,
      lowercase: true,
    },
    fiscalYear: {
      type: String,
      required: true,
      match: /^\d{4}$/, // Validates the 'yyyy' format
    },
    ticker_year: {
      type: String,
      required: true,
      unique: true,
    },
    raw: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

// Model definition
const BalanceSheet = mongoose.model<IBalanceSheet>(
  "BalanceSheet",
  balanceSheetSchema
);

export default BalanceSheet;
