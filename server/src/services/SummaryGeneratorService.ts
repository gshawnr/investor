// services/SummaryGeneratorService.ts
import { FilterQuery } from "mongoose";
import Profile from "../models/Profile";
import Summary from "../models/Summary";
import { IBalanceSheet, IBalanceSheetRaw } from "../types/IBalanceSheet";
import { ICashflow, ICashflowRaw } from "../types/ICashflow";
import { IIncome, IIncomeRaw } from "../types/IIncome";
import { IPrice } from "../types/IPrice";
import { IProfile } from "../types/IProfile";
import { ISummary } from "../types/ISummary";
import { getDocsByYearsForTicker } from "../utils/metricAndSummaryfuncs";
import ExchangeRateService from "./ExchangeRateService";
import PriceService from "./PriceService";
import TickerYearService from "./TickerYearService";

class SummaryGeneratorService {
  public async createSummaries(ticker?: string, year?: string): Promise<void> {
    try {
      const profiles = await this.getProfiles(ticker);
      console.log(
        `Found ${profiles.length} profiles${
          ticker ? ` for ticker "${ticker}"` : ""
        }.`
      );

      const exchangeRates = await ExchangeRateService.getExchangeRates({});
      const exchangeRateMap = new Map(
        exchangeRates.map((er) => [er.currency_year, er])
      );

      let totalSummariesCreated = 0;

      for (const p of profiles) {
        const { ticker: t } = p;

        const price = await this.getPrices(t);
        // skip summary generation if no price data is found as metric data will not be produced
        if (!price) {
          console.warn(`No price data found for ticker "${t}". Skipping.`);
          continue;
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
          const summaryData = await this.createSummary(docSet, p, price);
          if (summaryData) {
            // create / update TickerYear
            const { ticker_year } = summaryData;
            TickerYearService.createOrUpdateTickerYear({
              ticker_year,
              hasSummary: true,
            });
            createdForTicker++;
            totalSummariesCreated++;
            if (exampleTickerYears.length < 3) {
              exampleTickerYears.push(summaryData.ticker_year);
            }
          }
        }
      }

      console.log(
        `Summary generation completed. Total summaries created/updated: ${totalSummariesCreated}.`
      );
    } catch (err) {
      console.error("Summary generation failed:", err);
    }
  }

  // SHOULD BE SUING THE PROFILE SERVICE INSTEAD
  private async getProfiles(ticker?: string): Promise<IProfile[]> {
    const filter: FilterQuery<IProfile> = ticker
      ? { ticker: ticker.toLowerCase() }
      : {};

    return await Profile.find(filter);
  }

  private async getPrices(ticker: string): Promise<IPrice | null> {
    return await PriceService.getPriceByTicker(ticker.toLowerCase());
  }

  private async createSummary(
    docArr: [IIncome, IBalanceSheet, ICashflow],
    profile: IProfile,
    price: IPrice
  ): Promise<ISummary | undefined> {
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

      const summaryData = {
        ticker: profile.ticker,
        fiscalYear: balance.fiscalYear,
        ticker_year: balance.ticker_year,
        beta: profile.beta,
        industry: profile.industry,
        sector: profile.sector,
        assets: balanceRaw.totalAssets,
        currency: balanceRaw.reportedCurrency,
        currentAssets: balanceRaw.totalCurrentAssets,
        currentLiabilities: balanceRaw.totalCurrentLiabilities,
        equity: balanceRaw.totalEquity,
        liabilities: balanceRaw.totalLiabilities,
        longTermDebt: balanceRaw.longTermDebt,
        totalDebt: balanceRaw.totalDebt,
        avgSharesOutstanding: incomeRaw.weightedAverageShsOut,
        avgSharesOutstandingDiluted: incomeRaw.weightedAverageShsOutDil,
        costOfRevenue: incomeRaw.costOfRevenue,
        depreciationAndAmortization: incomeRaw.depreciationAndAmortization,
        ebitda: incomeRaw.ebitda,
        eps: incomeRaw.eps,
        epsDiluted: incomeRaw.epsDiluted,
        grossProfit: incomeRaw.grossProfit,
        netIncome: incomeRaw.netIncome,
        operatingExpenses: incomeRaw.operatingExpenses,
        operatingIncome: incomeRaw.operatingIncome,
        revenue: incomeRaw.revenue,
        capEx: cashflowRaw.capitalExpenditure,
        cashflowFromOps: cashflowRaw.netCashProvidedByOperatingActivities,
        // avgStockPrice: null, // Placeholder, as avgStockPrice is not available in the provided data
      };

      const updatedSummary = await Summary.findOneAndUpdate(
        { ticker_year: summaryData.ticker_year },
        summaryData,
        { upsert: true, new: true }
      );

      if (!updatedSummary) {
        throw new Error(
          `Failed to upsert summary for ticker_year: ${summaryData.ticker_year}`
        );
      }

      return updatedSummary;
    } catch (err) {
      const { ticker_year: ty } = balance;
      const msg = (err as Error).message || "Unknown error";
      console.error(`Error saving summary data for ${ty}:`, msg);
      return;
    }
  }
}

export default new SummaryGeneratorService();
