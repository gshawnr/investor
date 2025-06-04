import TickerYear from "../models/TickerYear";
import { ITickerYear } from "../types/ITickerYear";

type createInput = {
  ticker_year: string;
  hasSummary?: boolean;
  hasMetric?: boolean;
};

class TickerYearService {
  async createOrUpdateTickerYear(input: createInput): Promise<ITickerYear> {
    const [ticker, yearStr] = input.ticker_year.split("_");
    const { hasSummary, hasMetric } = input;

    const ticker_year = `${ticker}_${yearStr}`;

    const update: Partial<ITickerYear> = {
      ticker,
      year: yearStr,
      ticker_year,
    };

    if (hasMetric) {
      update.hasMetric = hasMetric;
    }
    if (hasSummary) {
      update.hasSummary = hasSummary;
    }

    return TickerYear.findOneAndUpdate(
      { ticker_year },
      {
        $set: update,
      },
      { new: true, runValidators: true, upsert: true }
    );
  }

  async getTickerYear() {}
  async getTickerYears(filter: {}, options: {}): Promise<ITickerYear[]> {
    return TickerYear.find(filter, null, options);
  }
  async deleteTickerYear() {}
}

export default new TickerYearService();
