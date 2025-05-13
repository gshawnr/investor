import { Document } from "mongoose";

export interface IIncome extends Document {
  ticker: string;
  fiscalYear: string;
  ticker_year: string;
  raw: object;
  createdAt: Date;
  updatedAt: Date;
}
