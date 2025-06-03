import { Document } from "mongoose";

export interface ITarget extends Document {
  ticker: string;
  ticker_year: string;
  fiscalYear: string;
  industry: string;
  sector: string;
  orignalCurrency: string;
  exchangeRate: number;
  dcfValueUSD: number;
  marketPriceUSD: number;
  targetPriceUSD: number;
  potentialReturn: number;
  createdAt?: Date;
  updatedAt?: Date;
}
