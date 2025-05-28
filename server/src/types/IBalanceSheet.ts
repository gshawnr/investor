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

export interface IBalanceSheetRaw {
  totalAssets: number;
  reportedCurrency: string;
  totalCurrentAssets: number;
  totalCurrentLiabilities: number;
  totalEquity: number;
  totalLiabilities: number;
  longTermDebt: number;
  totalDebt: number;
  [key: string]: any; // Allows for additional properties
}
