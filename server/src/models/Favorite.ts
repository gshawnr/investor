import { Schema, model } from "mongoose";
import { IFavorite } from "../types/IFavorite";

const favoriteSchema = new Schema(
  {
    ticker: { type: String, required: true },
    ticker_user: { type: String, required: true, unique: true },
    industry: { type: String, required: true },
    sector: { type: String, required: true },
    targetPurchasePriceUSD: { type: Number, require: true },
    targetPurchaseDate: { type: String, default: "" },
    targetSalesPriceUSD: { type: Number, require: true },
    targetSellDate: { type: String, default: "" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Favorite = model<IFavorite>("Favorite", favoriteSchema);

export default Favorite;
