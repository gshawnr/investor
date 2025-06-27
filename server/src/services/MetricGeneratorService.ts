import Metric from "../models/Metric";
import { IBalanceSheet, IBalanceSheetRaw } from "../types/IBalanceSheet";
import { ICalculationContants } from "../types/ICalculationConstants";
import { ICashflow, ICashflowRaw } from "../types/ICashflow";
import { IExchangeRate } from "../types/IExchangeRate";
import { IIncome, IIncomeRaw } from "../types/IIncome";
import { IMetric } from "../types/IMetric";
import { IPrice } from "../types/IPrice";
import { IProfile } from "../types/IProfile";
import { getDocsByYearsForTicker } from "../utils/metricAndSummaryfuncs";
import {
  getPerfromanceData,
  getProfitabilityData,
  getStabilityData,
  getValueData,
} from "../utils/metricCalculations";
import CalculationConstantsService from "./CalculationConstantsService";
import ExchangeRateService from "./ExchangeRateService";
import PriceService from "./PriceService";
import ProfileService from "./ProfileService";
import TickerYearService from "./TickerYearService";

class MetricGeneratorService {
  public async createMetrics(ticker?: string, year?: string): Promise<void> {
    try {
      const profiles = await this.getProfiles(ticker);
      if (!profiles || profiles.length === 0) {
        throw new Error("No profiles found for the given ticker.");
      }

      console.log(
        `Found ${profiles.length} profiles${
          ticker ? ` for ticker "${ticker}"` : ""
        }.`
      );

      const exchangeRates = await ExchangeRateService.getExchangeRates({});
      const exchangeRateMap = new Map(
        exchangeRates.map((er) => [er.currency_year, er])
      );

      let totalMetricsCreated = 0;

      for (const profile of profiles) {
        const { ticker: t } = profile;

        const price = await this.getPrices(t);
        if (!price) {
          console.warn(`No price data found for ticker "${t}". Skipping.`);
          continue;
        }

        let calculationConstants = await this.getCalculationContants(year);
        if (!calculationConstants) {
          // If no constants found for the specific year, get the latest
          calculationConstants = await this.getCalculationContants();
          if (!calculationConstants) {
            console.warn(
              `No calculation constants found for ticker "${t}" and year "${year}". Skipping.`
            );
            continue;
          }
        }

        const docSetsByYear = await getDocsByYearsForTicker(
          t,
          year,
          exchangeRateMap
        );

        console.log(
          `Ticker "${t}" - processing ${docSetsByYear.length} document sets.`
        );

        let createdForTicker = 0;
        const exampleTickerYears: string[] = [];

        for (const docSet of docSetsByYear) {
          const metricData = await this.createMetric(
            docSet,
            profile,
            price,
            calculationConstants,
            exchangeRateMap
          );
          if (metricData) {
            // create / update TickerYear
            const { ticker_year } = metricData;
            TickerYearService.createOrUpdateTickerYear({
              ticker_year,
              hasMetric: true,
            });

            createdForTicker++;
            totalMetricsCreated++;
            if (exampleTickerYears.length < 3) {
              exampleTickerYears.push(metricData.ticker_year);
            }
          }
        }
      }

      console.log(
        `Metric generation completed. Total metrics created/updated: ${totalMetricsCreated}.`
      );
    } catch (err) {
      const errorMessage = (err as Error).message || "Unknown error";
      console.error("Metric generation failed:", errorMessage);
    }
  }

  private async getProfiles(ticker?: string): Promise<IProfile[] | null> {
    if (!ticker) {
      return await ProfileService.getProfiles();
    }
    const profile = await ProfileService.getProfileByTicker(ticker);
    return profile ? [profile] : null;
  }

  private async getPrices(ticker: string): Promise<IPrice | null> {
    return await PriceService.getPriceByTicker(ticker.toLowerCase());
  }

  private async getCalculationContants(
    year?: string
  ): Promise<ICalculationContants | null> {
    return await CalculationConstantsService.getCalculationConstants(year);
  }

  private async createMetric(
    docArr: [IIncome, IBalanceSheet, ICashflow],
    profile: IProfile,
    price: IPrice,
    calculationConstants: ICalculationContants,
    exchangeRateMap: Map<string, IExchangeRate>
  ): Promise<IMetric | undefined> {
    const [income, balance, cashflow] = docArr;

    const balanceRaw = balance.raw as IBalanceSheetRaw;
    const incomeRaw = income.raw as IIncomeRaw;
    const cashflowRaw = cashflow.raw as ICashflowRaw;

    const year = balance.fiscalYear;

    try {
      const avgPriceByYear = price.averagePrices[year];
      if (!avgPriceByYear) {
        throw new Error(
          `No average price found for year ${year} in ticker ${profile.ticker}`
        );
      }

      const metricData = {
        ticker: profile.ticker,
        fiscalYear: year,
        ticker_year: balance.ticker_year,
        avgStockPrice: price.averagePrices[year],
        industry: profile.industry,
        sector: profile.sector,
        performanceData: getPerfromanceData(incomeRaw, balanceRaw),
        profitabilityData: getProfitabilityData(incomeRaw),
        stabilityData: getStabilityData(balanceRaw, incomeRaw),
        valueData: getValueData(
          incomeRaw,
          avgPriceByYear,
          profile,
          cashflowRaw,
          balanceRaw,
          calculationConstants,
          exchangeRateMap
        ),
      };

      const updatedMetric = await Metric.findOneAndUpdate(
        { ticker_year: metricData.ticker_year },
        metricData,
        { upsert: true, new: true }
      );

      if (!updatedMetric) {
        throw new Error(
          `Failed to upsert metric for ticker_year: ${metricData.ticker_year}`
        );
      }

      return updatedMetric;
    } catch (err) {
      const { ticker_year: ty } = balance;
      const msg = (err as Error).message || "Unknown error";
      console.error(`Error saving metric data for ${ty} : `, msg);
      return;
    }
  }
}

export default new MetricGeneratorService();
