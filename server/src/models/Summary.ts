import mongoose, { Schema } from "mongoose";
import { ISummary } from "../types/ISummary";

const summarySchema: Schema = new Schema(
  {
    ticker: { type: String, required: true, lowercase: true },
    fiscalYear: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ }, // Validates the 'yyyy-mm-dd' format
    ticker_year: { type: String, required: true, unique: true },
    beta: { type: Number, required: true },
    industry: { type: String, required: true },
    sector: { type: String, required: true },
    assets: { type: Number, required: true },
    currency: { type: String, required: true },
    currentAssets: { type: Number, required: true },
    currentLiabilities: { type: Number, required: true },
    equity: { type: Number, required: true },
    liabilities: { type: Number, required: true },
    longTermDebt: { type: Number, required: true },
    totalDebt: { type: Number, required: true },
    avgSharesOutstanding: { type: Number, required: true },
    avgSharesOutstandingDiluted: { type: Number, required: true },
    costOfRevenue: { type: Number, required: true },
    depreciationAndAmortization: { type: Number, required: true },
    ebitda: { type: Number, required: true },
    eps: { type: Number, required: true },
    epsDiluted: { type: Number, required: true },
    grossProfit: { type: Number, required: true },
    netIncome: { type: Number, required: true },
    operatingExpenses: { type: Number, required: true },
    operatingIncome: { type: Number, required: true },
    revenue: { type: Number, required: true },
    capEx: { type: Number, required: true },
    cashflowFromOps: { type: Number, required: true },
  },
  { timestamps: true }
);

const Summary = mongoose.model<ISummary>("Summary", summarySchema);
export default Summary;
