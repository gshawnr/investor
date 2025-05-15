import BalanceSheet from "../models/BalanceSheet";
import { IBalanceSheet } from "../types/IBalanceSheet"; // You might need to move your interface here

class BalanceSheetService {
  async createBalanceSheet(transformedBs: Partial<IBalanceSheet>) {
    const { ticker, fiscalYear, raw } = transformedBs;

    const ticker_year = `${ticker?.toLowerCase()}_${fiscalYear?.slice(0, 4)}`;

    const existing = await BalanceSheet.findOne({ ticker_year });
    if (existing) {
      throw new Error(`BalanceSheet for ${ticker_year} already exists.`);
    }

    const balanceSheet = new BalanceSheet({
      ticker,
      fiscalYear: fiscalYear,
      ticker_year,
      raw: raw,
    });

    return balanceSheet.save();
  }

  async getBalanceSheets() {
    return BalanceSheet.findOne({});
  }

  async getBalanceSheetByTickerYear(ticker: string, year: string) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return BalanceSheet.findOne({ ticker_year });
  }

  async getBalanceSheetsByTicker(ticker: string) {
    const formattedTicker = ticker.toLowerCase();
    return BalanceSheet.find({ ticker: formattedTicker }).sort({
      fiscalYear: -1,
    });
  }

  async updateBalanceSheet(
    ticker: string,
    year: string,
    updates: Partial<IBalanceSheet>
  ) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return BalanceSheet.findOneAndUpdate(
      { ticker_year },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async deleteBalanceSheet(ticker: string, year: string) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return BalanceSheet.findOneAndDelete({ ticker_year });
  }
}

export default new BalanceSheetService();
