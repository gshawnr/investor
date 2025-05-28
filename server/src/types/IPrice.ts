import { Document } from "mongoose";

export interface IPrice extends Document {
  ticker: string;
  price: number;
  date: string; // fomat: 'yyyy-mm-dd'
  averagePrices: { [year: string]: number }; // Map of year to average price
}
