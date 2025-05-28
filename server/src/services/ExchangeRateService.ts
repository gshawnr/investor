import ExchangeRate from "../models/ExchangeRate";
import { IExchangeRate } from "../types/IExchangeRate";

class ExchangeRateService {
  async createExchangeRate(data: Partial<IExchangeRate>) {
    const { year, currency, rateToUSD } = data;

    const numericFields = {
      rateToUSD,
    };

    const parsedFields: Record<string, number> = {};

    for (const [key, value] of Object.entries(numericFields)) {
      const parsed = typeof value === "string" ? parseFloat(value) : value;

      if (typeof parsed !== "number" || isNaN(parsed)) {
        throw new Error(`${key} must be a valid number or numeric string`);
      }

      parsedFields[key] = parsed;
    }

    const currency_year = `${currency}_${year}`;
    const existing = await ExchangeRate.findOne({
      currency_year,
    });
    if (existing) {
      throw new Error(`exchange rate for ${currency}_${year} already exists`);
    }

    const newExchangeRate = new ExchangeRate({
      currency_year,
      currency,
      year,
      rateToUSD: parsedFields.rateToUSD,
    });

    return newExchangeRate.save();
  }

  async getExchangeRates(data: Partial<IExchangeRate>) {
    const { year, currency } = data;
    const filter: Partial<IExchangeRate> = {};

    if (year) filter.year = year;
    if (currency) filter.currency = currency;

    return ExchangeRate.find(filter).sort({ year: -1 });
  }

  async updateExchangeRate(
    currency: string,
    year: string,
    updates: Partial<IExchangeRate>
  ) {
    const numericKeys: (keyof IExchangeRate)[] = ["rateToUSD"];

    const parsedUpdates: Partial<IExchangeRate> = {};

    for (const key of numericKeys) {
      const value = updates[key];
      if (value !== undefined) {
        const parsed = typeof value === "string" ? parseFloat(value) : value;

        if (typeof parsed !== "number" || isNaN(parsed)) {
          throw new Error(`${key} must be a valid number or numeric string`);
        }

        (parsedUpdates as Record<string, number>)[key] = parsed;
      }
    }

    return ExchangeRate.findOneAndUpdate(
      { currency, year },
      { $set: parsedUpdates },
      { new: true, runValidators: true }
    );
  }

  async deleteExchangeRate(currency: string, year: string) {
    return ExchangeRate.findOneAndDelete({ currency, year });
  }
}

export default new ExchangeRateService();
