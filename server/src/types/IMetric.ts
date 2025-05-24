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
    debtToEquity: number;
    debtToEbitda: number;
    currentRatio: number;
  };
  valueData: {
    dcfToAvgPrice: number;
    dcfValuePerShare: number;
    priceToEarnings: number;
    earningsYield: number;
    priceToSales: number;
    priceToBook: number;
  };
}
