import mongoose, { Schema } from "mongoose";
import { IMetric } from "../types/IMetric";

const metricSchema: Schema = new Schema(
  {
    ticker: { type: String, required: true, lowercase: true },
    fiscalYear: { type: String, required: true, match: /^\d{4}$/ }, // Validates the 'yyyy' format
    ticker_year: { type: String, required: true, unique: true },
    avgStockPrice: { type: Number, required: true },
    industry: { type: String, required: true },
    sector: { type: String, required: true },
    performanceData: {
      returnOnEquity: { type: Number, required: true },
      salesToEquity: { type: Number, required: true },
    },
    profitabilityData: {
      grossMargin: { type: Number, required: true },
      netMargin: { type: Number, required: true },
    },
    stabilityData: {
      debtToEquity: { type: Number || null, required: true },
      debtToEbitda: { type: Number || null, required: true },
      currentRatio: { type: Number, required: true },
    },
    valueData: {
      dcfToAvgPrice: { type: Number, required: true },
      dcfValuePerShare: { type: Number, required: true },
      priceToEarnings: { type: Number || null, required: true },
      earningsYield: { type: Number || null, required: true },
      priceToSales: { type: Number || null, required: true },
      priceToBook: { type: Number || null, required: true },
    },
  },
  { timestamps: true }
);

const Metric = mongoose.model<IMetric>("Metric", metricSchema);

export default Metric;
