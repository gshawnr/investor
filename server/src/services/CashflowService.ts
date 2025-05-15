import CashFlow from "../models/Cashflow";
import { ICashflow } from "../types/ICashflow";

class CashFlowService {
  async createCashFlow(transformedCf: Partial<ICashflow>) {
    const { ticker, fiscalYear, raw } = transformedCf;

    const ticker_year = `${ticker?.toLowerCase()}_${fiscalYear?.slice(0, 4)}`;

    const existing = await CashFlow.findOne({ ticker_year });
    if (existing) {
      throw new Error(`CashFlow for ${ticker_year} already exists.`);
    }

    const cashFlow = new CashFlow({
      ticker,
      fiscalYear,
      ticker_year,
      raw,
    });

    return cashFlow.save();
  }

  async getCashFlows() {
    return CashFlow.find({});
  }

  async getCashFlowByTickerYear(ticker: string, year: string) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return CashFlow.findOne({ ticker_year });
  }

  async getCashFlowsByTicker(ticker: string) {
    const formattedTicker = ticker.toLowerCase();
    return CashFlow.find({ ticker: formattedTicker }).sort({
      fiscalYear: -1,
    });
  }

  async updateCashFlow(
    ticker: string,
    year: string,
    updates: Partial<ICashflow>
  ) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return CashFlow.findOneAndUpdate(
      { ticker_year },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async deleteCashFlow(ticker: string, year: string) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return CashFlow.findOneAndDelete({ ticker_year });
  }
}

export default new CashFlowService();
