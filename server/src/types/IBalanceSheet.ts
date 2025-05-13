// types/IBalanceSheet.ts
import { Document } from "mongoose";

export interface IBalanceSheet extends Document {
  ticker: string;
  fiscalYear: string; // Format: 'yyyy-mm-dd'
  ticker_year: string; // Concatenation of ticker symbol and fiscal year
  raw: object; // Original statement object
  createdAt?: Date;
  updatedAt?: Date;
}
