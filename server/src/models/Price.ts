import mongoose, { Schema } from "mongoose";
import { IPrice } from "../types/IPrice";

const PriceSchema: Schema<IPrice> = new Schema({
  ticker: {
    type: String,
    required: true,
    lowercase: true,
    unique: true, // Ensure unique ticker entries
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    match: /^\d{4}-\d{2}-\d{2}$/, // Format: 'yyyy-mm-dd'
    required: true, // Date in 'yyyy-mm-dd' format
  },
  averagePrices: { type: Object, default: {} },
});

const Price = mongoose.model<IPrice>("Price", PriceSchema);

export default Price;
