import { IIncome, IIncomeRaw } from "../types/IIncome";
import { IBalanceSheet } from "../types/IBalanceSheet";
import { ICashflow } from "../types/ICashflow";
import { IProfile } from "../types/IProfile";
import { FilterQuery } from "mongoose";
import Income from "../models/Income";
import BalanceSheet from "../models/BalanceSheet";
import Cashflow from "../models/Cashflow";

export async function getDocsByYearsForTicker(
  ticker: string,
  year?: string,
  exchangeRateMap?: Map<string, any>
): Promise<[IIncome, IBalanceSheet, ICashflow][]> {
  const filter: FilterQuery<IProfile> = year
    ? { ticker_year: `${ticker}_${year}` }
    : { ticker };

  const [inc, bal, cash] = await Promise.all([
    Income.find(filter),
    BalanceSheet.find(filter),
    Cashflow.find(filter),
  ]);

  const balMap = new Map(bal.map((b) => [b.ticker_year, b]));
  const cashMap = new Map(cash.map((c) => [c.ticker_year, c]));

  const filtered = inc
    .map<[IIncome, IBalanceSheet, ICashflow] | null>((i) => {
      const { fiscalYear, ticker_year, raw: iRaw } = i;
      const { reportedCurrency } = iRaw as IIncomeRaw;

      const foundBal = balMap.get(ticker_year);
      const foundCash = cashMap.get(ticker_year);

      const docExchangeRate = exchangeRateMap
        ? exchangeRateMap.get(`${reportedCurrency}_${fiscalYear}`)
        : undefined;

      if (foundBal && foundCash && docExchangeRate) {
        return [i, foundBal, foundCash];
      }

      return null;
    })
    .filter((set): set is [IIncome, IBalanceSheet, ICashflow] => set !== null);

  return filtered;
}
