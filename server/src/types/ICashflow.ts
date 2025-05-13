import { Document } from "mongoose";

export interface ICashflow extends Document {
  ticker: string;
  fiscalYear: string; // 'yyyy-mm-dd'
  ticker_year: string; // 'symbol_yyyy'
  raw: object;
  createdAt?: Date;
  updatedAt?: Date;
}
