import { ITickerYear } from "../types/ITickerYear";
import { Schema, model } from "mongoose";

const tickerYearSchema: Schema = new Schema(
  {
    ticker: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
      match: /^\d{4}$/,
    },
    ticker_year: {
      type: String,
      required: true,
      unique: true,
    },
    hasSummary: { type: Boolean, required: true, default: false },
    hasMetric: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const TickerYear = model<ITickerYear>("TickerYear", tickerYearSchema);

export default TickerYear;
