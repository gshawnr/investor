import { Document } from "mongoose";

export interface IMetric extends Document {
  ticker: string;
  fiscalYear: string;
  ticker_year: string;
  avgStockPrice: number;
  industry: string;
  sector: string;
  performanceData: {
    returnOnEquity: number;
    salesToEquity: number;
  };
  profitabilityData: {
    grossMargin: number;
    netMargin: number;
  };
  stabilityData: {
    debtToEquity: number | null;
    debtToEbitda: number | null;
    currentRatio: number;
  };
  valueData: {
    dcfToAvgPrice: number;
    dcfValuePerShare: number;
    priceToEarnings: number | null;
    earningsYield: number | null;
    priceToSales: number | null;
    priceToBook: number | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
