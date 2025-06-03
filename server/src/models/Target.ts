import { Schema, model } from "mongoose";
import { ITarget } from "../types/ITarget";

const targetSchema = new Schema(
  {
    ticker: { type: String, required: true },
    ticker_year: { type: String, unique: true, required: true },
    fiscalYear: { type: String, required: true },
    industry: { type: String, required: true },
    sector: { type: String, required: true },
    originalCurrency: { type: String, required: true },
    exchangeRate: { type: Number, require: true },
    dcfValueUSD: { type: Number, require: true },
    marketPriceUSD: { type: Number, require: true },
    targetPriceUSD: { type: Number, require: true },
    potentialReturn: { type: Number, require: true },
  },
  { timestamps: true }
);

const Target = model<ITarget>("Target", targetSchema);

export default Target;
