// services/SummaryGeneratorService.ts
import Profile from "../models/Profile";
import IncomeStatement from "../models/Income";
import BalanceSheet from "../models/BalanceSheet";
import CashFlow from "../models/Cashflow";
import Summary from "../models/Summary";
import { ISummary } from "../types/ISummary";
import { IBalanceSheet, IBalanceSheetRaw } from "../types/IBalanceSheet";
import { IIncome, IIncomeRaw } from "../types/IIncome";
import { ICashflow, ICashflowRaw } from "../types/ICashflow";
import { IProfile } from "../types/IProfile";
import { FilterQuery } from "mongoose";

class SummaryGeneratorService {
  public async createSummaries(ticker?: string, year?: string): Promise<void> {
    try {
      const profiles = await this.getProfiles(ticker);
      console.log(
        `Found ${profiles.length} profiles${
          ticker ? ` for ticker "${ticker}"` : ""
        }.`
      );

      let totalSummariesCreated = 0;

      for (const p of profiles) {
        const { ticker: t } = p;
        const docSetsByYear = await this.getDocsByYearsForTicker(t, year);

        console.log(
          `Ticker "${t}" - processing ${docSetsByYear.length} document sets.`
        );

        let createdForTicker = 0;
        const exampleTickerYears: string[] = [];

        for (const docSet of docSetsByYear) {
          const summaryData = await this.createSummary(docSet, p);
          if (summaryData) {
            createdForTicker++;
            totalSummariesCreated++;
            if (exampleTickerYears.length < 3) {
              exampleTickerYears.push(summaryData.ticker_year);
            }
          }
        }

        console.log(
          `Ticker "${t}" - created/updated ${createdForTicker} summaries.` +
            (exampleTickerYears.length
              ? ` Examples: ${exampleTickerYears.join(", ")}`
              : "")
        );
      }

      console.log(
        `Summary generation completed. Total summaries created/updated: ${totalSummariesCreated}.`
      );
    } catch (err) {
      console.error("Summary generation failed:", err);
    }
  }

  private async getProfiles(ticker?: string): Promise<IProfile[]> {
    const filter: FilterQuery<IProfile> = ticker
      ? { ticker: ticker.toLowerCase() }
      : {};

    return await Profile.find(filter);
  }

  private async getDocsByYearsForTicker(
    ticker: string,
    year?: string
  ): Promise<[IIncome, IBalanceSheet, ICashflow][]> {
    const filter: FilterQuery<IProfile> = year
      ? { ticker_year: `${ticker}_${year}` }
      : { ticker };

    const [inc, bal, cash] = await Promise.all([
      IncomeStatement.find(filter),
      BalanceSheet.find(filter),
      CashFlow.find(filter),
    ]);

    const balMap = new Map(bal.map((b) => [b.ticker_year, b]));
    const cashMap = new Map(cash.map((c) => [c.ticker_year, c]));

    const filtered = inc
      .map<[IIncome, IBalanceSheet, ICashflow] | null>((i) => {
        const ticker_year = i.ticker_year;
        const foundBal = balMap.get(ticker_year);
        const foundCash = cashMap.get(ticker_year);

        if (foundBal && foundCash) {
          return [i, foundBal, foundCash];
        }

        return null;
      })
      .filter(
        (set): set is [IIncome, IBalanceSheet, ICashflow] => set !== null
      );

    return filtered;
  }

  private async createSummary(
    docArr: [IIncome, IBalanceSheet, ICashflow],
    profile: IProfile
  ): Promise<ISummary | undefined> {
    const [income, balance, cashflow] = docArr;

    const balanceRaw = balance.raw as IBalanceSheetRaw;
    const incomeRaw = income.raw as IIncomeRaw;
    const cashflowRaw = cashflow.raw as ICashflowRaw;

    try {
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
      console.error("Error saving summary data:", err);
      return;
    }
  }
}

export default new SummaryGeneratorService();
