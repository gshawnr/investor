import mongoose, { Schema } from "mongoose";
import { IExchangeRate } from "../types/IExchangeRate";

const exchangeRateSchema = new Schema(
  {
    currency_year: { type: String, required: true, unique: true },
    year: { type: String, required: true },
    currency: { type: String, required: true, upperCase: true },
    rateToUSD: { type: Number, required: true },
  },
  { timestamps: true }
);

const ExchangeRate = mongoose.model<IExchangeRate>(
  "ExchangeRate",
  exchangeRateSchema
);

export default ExchangeRate;
