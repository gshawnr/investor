import mongoose, { Schema } from "mongoose";
import { IIncome } from "../types/IIncome";

const incomeSchema = new Schema(
  {
    ticker: {
      type: String,
      required: true,
      lowercase: true,
    },
    fiscalYear: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/, // Validates the 'yyyy-mm-dd' format
    },
    ticker_year: {
      type: String,
      required: true,
      unique: true,
    },
    raw: { type: Object, required: true },
  },
  { timestamps: true }
);

const Income = mongoose.model<IIncome>("Income", incomeSchema);

export default Income;
