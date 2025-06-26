import { Document, Types } from "mongoose";

export interface IFavorite extends Document {
  ticker: string;
  ticker_user: string;
  industry: string;
  sector: string;
  targetPurchasePriceUSD: number;
  targetSalesPriceUSD: number;
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateFavoriteInputType = {
  ticker: string;
  ticker_user: string;
  industry: string;
  sector: string;
  targetPurchasePriceUSD: number;
  targetSalesPriceUSD: number;
  userId: Types.ObjectId;
};
