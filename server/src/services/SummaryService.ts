import Summary from "../models/Summary";
import SummaryGenerator from "./SummaryGeneratorService";
import { ISummary } from "../types/ISummary";

type createArgs = {
  ticker: string | null;
  year: string | null;
};

class SummaryService {
  async createSummaries(ticker?: string, fiscalYear?: string): Promise<void> {
    await SummaryGenerator.createSummaries(ticker, fiscalYear);
  }

  async getSummary() {
    return Summary.find({});
  }

  async getSummaries({ filter = {}, options = {} }) {
    return Summary.find(filter, null, options);
  }

  async getSummaryByTickerYear(ticker: string, year: string) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return Summary.findOne({ ticker_year });
  }

  async getSummariesByTicker(ticker: string) {}

  async updateSummary(
    ticker: string,
    year: string,
    updates: Partial<ISummary>
  ) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return Summary.findOneAndUpdate(
      { ticker_year },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async deleteSummary(ticker: string, year: string) {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return Summary.findOneAndDelete({ ticker_year });
  }
}

export default new SummaryService();
