import TickerYear from "../models/TickerYear";
import { ITickerYear } from "../types/ITickerYear";
import Metric from "../models/Metric";
import Summary from "../models/Summary";

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

  async getDataByTickerYears({
    filter = {},
    options = {},
  }): Promise<Record<string, any>> {
    const tickerYears = await TickerYear.find(filter, null, options);
    const tyStrs = getTickerYears(tickerYears);

    const [metrics, summaries, totalCount] = await Promise.all([
      Metric.find({ ticker_year: { $in: tyStrs } }),
      Summary.find({ ticker_year: { $in: tyStrs } }),
      Summary.countDocuments(filter),
    ]);

    return formatResponse(tyStrs, metrics, summaries, totalCount);
  }

  async deleteTickerYear() {}
}

export default new TickerYearService();

function getTickerYears(data: any[]): any[] {
  const tickerYears = data.map((ty) => ty.ticker_year);
  return tickerYears;
}

function formatResponse(
  tickerYears: any,
  metricData: any,
  summaryData: any,
  totalCount: number
): Record<string, any> {
  return {
    keys: tickerYears,
    metrics: metricData,
    summaries: summaryData,
    totalCount,
  };
}
