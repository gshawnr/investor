import { Document } from "mongoose";

export interface IExchangeRate {
  currency_year: string;
  year: string;
  currency: string;
  rateToUSD: number;
  createdAt?: Date;
  updatedAt?: Date;
}
