import Income from "../models/Income";
import { IIncome } from "../types/IIncome";

class IncomeService {
  async createIncome(transformedIs: Partial<IIncome>) {
    const { ticker, fiscalYear, raw } = transformedIs;

    const ticker_year = `${ticker?.toLowerCase()}_${fiscalYear?.slice(0, 4)}`;

    const existing = await Income.findOne({ ticker_year });
    if (existing) {
      throw new Error(`income for ${ticker_year} alread exists`);
    }

    const income = new Income({ ticker, fiscalYear, ticker_year, raw });

    return await income.save();
  }

  async getIncome() {
    return await Income.find({});
  }

  async getIncomeByTicker(ticker: string) {
    const formattedTicker = ticker.toLowerCase();
    return await Income.find({ ticker: formattedTicker }).sort({
      fiscalYear: -1,
    });
  }

  async getIncomeByTickerYear(ticker: string, year: string) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return await Income.findOne({ ticker_year });
  }

  async updateIncome(ticker: string, year: string, updates: Partial<IIncome>) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return await Income.findOneAndUpdate(
      { ticker_year },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async deleteIncome(ticker: string, year: string) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return await Income.deleteOne({ ticker_year });
  }
}

export default new IncomeService();
