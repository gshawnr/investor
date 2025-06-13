import { Document } from "mongoose";
import { IMetric } from "./IMetric";
import { ISummary } from "./ISummary";

export interface ITickerYear extends Document {
  ticker_year: string;
  ticker: string;
  year: string;
  hasSummary: boolean;
  hasMetric: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITickerYearFetch {
  keys: string[];
  metricsObj: Record<string, IMetric>;
  summariesObj: Record<string, ISummary>;
}
