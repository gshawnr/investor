import mongoose, { Schema } from "mongoose";
import { ICashflow } from "../types/ICashflow";

const CashflowSchema: Schema = new Schema(
  {
    ticker: {
      type: String,
      required: true,
      lowercase: true,
    },
    fiscalYear: {
      type: String,
      required: true,
      match: /^\d{4}$/, // Validates the 'yyyy' format
    },
    ticker_year: {
      type: String,
      required: true,
      unique: true,
    },
    raw: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const Cashflow = mongoose.model<ICashflow>("Cashflow", CashflowSchema);

export default Cashflow;
