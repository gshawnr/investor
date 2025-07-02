import { validTargetRequirements } from "../data/targetData";
import Target from "../models/Target";
import { ICalculationContants } from "../types/ICalculationConstants";
import { IMetric } from "../types/IMetric";
import { IPrice } from "../types/IPrice";
import { IProfile } from "../types/IProfile";
import { ISummary } from "../types/ISummary";
import { formatDecimals } from "../utils/utiilityFunctions";
import CalculationConstantsService from "./CalculationConstantsService";
import ExchangeRateService from "./ExchangeRateService";
import MetricService from "./MetricService";
import PriceService from "./PriceService";
import ProfileService from "./ProfileService";
import SummaryService from "./SummaryService";
import TargetService from "./TargetService";

class TargetGeneratorService {
  async createTargets() {
    try {
      // DELETE previous

      await TargetService.deleteTargets();

      const profiles = await ProfileService.getProfiles();
      if (!profiles || profiles.length === 0) {
        throw new Error("No profiles found for the given ticker.");
      }

      let totalTargetsCreated = 0;
      const calculationConstants = await this.getCalculationContants();
      if (!calculationConstants) {
        throw new Error(
          "Create Targets error: unable to fetch calculation constants."
        );
      }

      for (const profile of profiles) {
        try {
          const { ticker: t } = profile;

          // USD Price
          const price = await this.getPrices(t);
          if (!price) {
            console.warn(`No price data found for ticker "${t}". Skipping.`);
            continue;
          }

          const {
            docs: validTargetSetByYear,
            multiplier,
            latestFiscalYear,
          } = await this.getDocsByTicker(t);

          let createdForTicker = 0;

          for (const docSet of validTargetSetByYear) {
            const targetCreated = await this.createTarget(
              docSet,
              profile,
              price,
              calculationConstants,
              multiplier,
              latestFiscalYear
            );

            if (targetCreated) {
              createdForTicker++;
              totalTargetsCreated++;
            }
          }
        } catch (err) {
          const errorMessage = (err as Error).message || "Unknown error";
          console.error(
            `Target generation failed for ticker ${profile.ticker}:`,
            errorMessage
          );
        }
      }

      console.log(
        `Target generation completed. Total targets created/updated: ${totalTargetsCreated}.`
      );
    } catch (err) {
      const errorMessage = (err as Error).message || "Unknown error";
      console.error("Target generation failed:", errorMessage);
    }
  }

  private async getPrices(ticker: string): Promise<IPrice | null> {
    return await PriceService.getPriceByTicker(ticker.toLowerCase());
  }

  private async getCalculationContants(
    year?: string
  ): Promise<ICalculationContants | null> {
    return await CalculationConstantsService.getCalculationConstants(year);
  }

  private async getDocsByTicker(ticker: string): Promise<{
    docs: [IMetric, ISummary][];
    multiplier: number;
    latestFiscalYear: string | undefined;
  }> {
    const filter = { ticker };
    const options = { sort: { fiscalYear: -1 }, limit: 5 };

    const [metrics, summaries] = await Promise.all([
      MetricService.getMetrics({ filter, options }),
      SummaryService.getSummaries({ filter, options }),
    ]);

    const { fiscalYear: latestFiscalYear } = metrics[0] || {};

    const validTarget = this.isValidTarget(metrics);
    if (!validTarget) {
      return { docs: [], multiplier: 0, latestFiscalYear };
    }

    const ticketMultiplier = this.generateTickerMultiplier(metrics);

    const summaryMap = new Map(summaries.map((c) => [c.ticker_year, c]));

    const filtered = metrics
      .map<[IMetric, ISummary] | null>((metric) => {
        const ticker_year = metric.ticker_year;
        const foundSummary = summaryMap.get(ticker_year);

        if (foundSummary) {
          return [metric, foundSummary];
        }

        return null;
      })
      .filter((set): set is [IMetric, ISummary] => set !== null);

    return { docs: filtered, multiplier: ticketMultiplier, latestFiscalYear };
  }

  private async createTarget(
    docArr: [IMetric, ISummary],
    profile: IProfile,
    price: IPrice,
    calculationConstants: ICalculationContants,
    multiplier: number,
    latestFiscalYear: string | undefined
  ): Promise<boolean> {
    const [metric, summary] = docArr;

    const { industry } = summary;

    // metric data
    const { ticker_year, valueData, ticker, fiscalYear } = metric;
    const { dcfValuePerShare } = valueData;
    const targetPrice =
      dcfValuePerShare > 0 ? dcfValuePerShare / multiplier : 0;

    // summary data
    const { currency } = summary;

    // profile data
    const { exchange } = profile;

    // price data
    let marketPrice: number;
    if (latestFiscalYear && fiscalYear === latestFiscalYear) {
      marketPrice = price.price;
    } else {
      marketPrice = price.averagePrices[fiscalYear];
    }

    if (!marketPrice) {
      throw new Error(`average market price not found for: ${ticker_year} `);
    }

    // exchange rate
    const exchangeRate = await ExchangeRateService.getExchangeRates({
      year: fiscalYear,
      currency,
    });
    if (!exchangeRate || exchangeRate.length == 0) {
      throw new Error(`exchange rates not found for currency: ${currency} `);
    }

    const { rateToUSD } = exchangeRate[0];
    const dcfValueUSD = formatDecimals(dcfValuePerShare, 2);
    const marketPriceUSD = formatDecimals(marketPrice, 2);
    const targetPriceUSD = formatDecimals(targetPrice, 2);

    // Upsert operation
    const res = await Target.updateOne(
      { ticker_year }, // Filter by ticker and fiscalYear
      {
        ticker,
        ticker_year,
        fiscalYear,
        exchange,
        industry,
        originalCurrency: currency,
        exchangeRate: rateToUSD,
        dcfValueUSD,
        marketPriceUSD,
        targetPriceUSD,
        potentialReturn: formatDecimals(
          ((targetPriceUSD - marketPriceUSD) / marketPriceUSD) * 100,
          2
        ),
      },
      { upsert: true } // Upsert option
    );
    const success =
      res.acknowledged && (res.modifiedCount > 0 || res.upsertedCount > 0);
    return success;
  }

  private isValidTarget(metricArr: IMetric[]): boolean {
    return metricArr.every((data) => {
      try {
        const { performanceData, profitabilityData, stabilityData, industry } =
          data;

        if (validTargetRequirements.excludedIndustries.includes(industry)) {
          return false;
        }

        const { returnOnEquity } = performanceData;
        const { grossMargin, netMargin } = profitabilityData;
        const { debtToEquity, currentRatio } = stabilityData;

        let roe = evaluateCriteria(returnOnEquity, validTargetRequirements.roe);
        let dte = evaluateCriteria(
          debtToEquity,
          validTargetRequirements.debtToEquity
        );
        let gm = evaluateCriteria(
          grossMargin,
          validTargetRequirements.grossMargin
        );
        let nm = evaluateCriteria(netMargin, validTargetRequirements.netMargin);
        let cr = evaluateCriteria(
          currentRatio,
          validTargetRequirements.currentRatio
        );

        // return roe && dte && gm && nm && cr ? true : false;
        return roe && nm && gm && dte && cr ? true : false;

        function evaluateCriteria(
          value: number | null,
          criteria: Record<string, number>
        ): boolean {
          if (!value && value != 0) {
            return false;
          }

          if (criteria.lte !== undefined) {
            return value <= criteria.lte;
          }

          if (criteria.gte !== undefined) {
            return value >= criteria.gte;
          }

          throw new Error(
            `evaluateCriteria Error: value:${value}, criteria: ${criteria} `
          );
        }
      } catch (err) {
        const msg = (err as Error).message || "unknown error";
        console.log("TargetGeneratorService isValidTarget Error", msg);
        return false;
      }
    });
  }

  private generateTickerMultiplier = (metrics: IMetric[]) => {
    const { sum, count } = metrics.reduce(
      (acc, item) => {
        const value = item.valueData.dcfToAvgPrice;
        if (value != null && value >= 0) {
          acc.sum += value;
          acc.count += 1;
        }
        return acc;
      },
      { sum: 0, count: 0 }
    );

    // Compute the average
    const average = count > 0 ? sum / count : 0;
    return average;
  };
}

export default new TargetGeneratorService();
