import Metric from "../models/Metric";
import MetricGeneratorService from "./MetricGeneratorService";
import { IMetric } from "../types/IMetric";

type createArgs = { ticker: string; fiscalYear: string };

class MetricService {
  async createMetric(ticker?: string, fiscalYear?: string): Promise<void> {
    await MetricGeneratorService.createMetrics(ticker, fiscalYear);
  }

  async getMetrics({ filter = {}, options = {} }): Promise<IMetric[]> {
    return Metric.find(filter, null, options);
  }

  async getMetricsCount(filter = {}): Promise<number> {
    return Metric.find(filter).countDocuments();
  }

  async getMetricByTickerYear(
    ticker: string,
    year: string
  ): Promise<IMetric | null> {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return Metric.findOne({ ticker_year });
  }

  async updateMetric(
    ticker: string,
    year: string,
    updates: Partial<IMetric>
  ): Promise<IMetric | null> {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return Metric.findOneAndUpdate(
      { ticker_year },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async deleteMetric(ticker: string, year: string): Promise<IMetric | null> {
    const ticker_year = `${ticker.toLowerCase()}_${year}`;
    return Metric.findOneAndDelete({ ticker_year });
  }
}

export default new MetricService();
