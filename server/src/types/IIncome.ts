import { Document } from "mongoose";

export interface IIncome extends Document {
  ticker: string;
  fiscalYear: string;
  ticker_year: string;
  raw: object;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIncomeRaw {
  weightedAverageShsOut: number;
  weightedAverageShsOutDil: number;
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
  reportedCurrency: string;
  [key: string]: any; // Allows for additional properties
}
