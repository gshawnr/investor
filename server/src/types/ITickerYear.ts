import { Document } from "mongoose";

export interface ITickerYear extends Document {
  ticker_year: string;
  ticker: string;
  year: string;
  hasSummary: boolean;
  hasMetric: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
