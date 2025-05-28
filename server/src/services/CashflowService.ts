import CashflowModel from "../models/Cashflow";
import { ICashflow } from "../types/ICashflow";

class CashflowService {
  async createCashflow(transformedCf: Partial<ICashflow>) {
    const { ticker, fiscalYear, raw } = transformedCf;

    const ticker_year = `${ticker?.toLowerCase()}_${fiscalYear?.slice(0, 4)}`;

    const existing = await CashflowModel.findOne({ ticker_year });
    if (existing) {
      throw new Error(`Cashflow for ${ticker_year} already exists.`);
    }

    const Cashflow = new CashflowModel({
      ticker,
      fiscalYear,
      ticker_year,
      raw,
    });

    return Cashflow.save();
  }

  async getCashflow() {
    return CashflowModel.find({});
  }

  async getCashflowByTickerYear(ticker: string, year: string) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return CashflowModel.findOne({ ticker_year });
  }

  async getCashflowsByTicker(ticker: string) {
    const formattedTicker = ticker.toLowerCase();
    return CashflowModel.find({ ticker: formattedTicker }).sort({
      fiscalYear: -1,
    });
  }

  async updateCashflow(
    ticker: string,
    year: string,
    updates: Partial<ICashflow>
  ) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return CashflowModel.findOneAndUpdate(
      { ticker_year },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async deleteCashflow(ticker: string, year: string) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return CashflowModel.findOneAndDelete({ ticker_year });
  }
}

export default new CashflowService();
