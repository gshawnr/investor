import mongoose, { Schema, Document } from "mongoose";

// Interface for the balance sheet
interface IBalanceSheet extends Document {
  ticker: string;
  fiscalYear: string; // Format: 'yyyy-mm-dd'
  tickerYear: string; // Concatenation of ticker symbol and fiscal year
  raw: object; // Original statement object
}

// Schema for the balance sheet
const balanceSheetSchema: Schema = new Schema({
  ticker: {
    type: String,
    required: true,
    uppercase: true,
  },
  fiscalYear: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/, // Validates the 'yyyy-mm-dd' format
  },
  tickerYear: {
    type: String,
    required: true,
    unique: true,
  },
  raw: {
    type: Object,
    required: true,
  },
});

// Model definition
const BalanceSheet = mongoose.model<IBalanceSheet>(
  "BalanceSheet",
  balanceSheetSchema
);

export default BalanceSheet;
