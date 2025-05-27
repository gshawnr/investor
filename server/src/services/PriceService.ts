import { Document } from "mongoose";
import Price from "../models/Price";

import { IPrice } from "../types/IPrice";

class PriceService {
  async createPrice(data: Partial<IPrice>): Promise<IPrice> {
    const { ticker, price, date, averagePrices } = data;

    const existing = await Price.findOne({ ticker: ticker?.toLowerCase() });
    if (existing) {
      throw new Error(`Price for ticker ${ticker} already exists.`);
    }

    const priceInstance = new Price({
      ticker: ticker?.toLowerCase(),
      price,
      date,
      averagePrices,
    });

    return priceInstance.save();
  }

  async getPriceByTicker(ticker: string): Promise<IPrice | null> {
    const price = Price.findOne({ ticker: ticker.toLowerCase() });
    return price;
  }

  async updatePrice(ticker: string, update: IPrice): Promise<IPrice | null> {
    const updatedPrice = Price.findOneAndUpdate(
      { ticker: ticker.toLowerCase() },
      { $set: update },
      { new: true, runValidators: true }
    );

    return updatedPrice;
  }

  async deletePrice(ticker: string): Promise<IPrice | null> {
    const deleted = Price.findOneAndDelete({ ticker: ticker.toLowerCase() });
    return deleted;
  }
}

export default new PriceService();
