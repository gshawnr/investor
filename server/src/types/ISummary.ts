import { Document } from "mongoose";

export interface ISummary extends Document {
  ticker: string;
  fiscalYear: string; // Format: 'yyyy-mm-dd'
  ticker_year: string; // Concatenation of ticker symbol and fiscal year
  beta: number;
  industry: string;
  sector: string;
  assets: number;
  currency: string;
  currentAssets: number;
  currentLiabilities: number;
  equity: number;
  liabilities: number;
  longTermDebt: number;
  totalDebt: number;
  avgSharesOutstanding: number;
  avgSharesOutstandingDiluted: number;
  costOfRevenue: number;
  depreciationAndAmortization: number;
  ebitda: number;
  eps: number;
  epsDiluted: number;
  grossProfit: number;
  netIncome: number;
  operatingExpenses: number;
  operatingIncome: number;
  revenue: number;
  capEx: number;
  cashflowFromOps: number;
  // avgStockPrice: number;
}
