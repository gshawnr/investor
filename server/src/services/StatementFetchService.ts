import {
  getBalanceSheets,
  getIncomes,
  getCashflows,
  getPrices,
  getProfile,
} from "../apis/finApiService";
import BalanceSheetService from "./BalanceSheetService";
import IncomeService from "./IncomeService";
import CashflowService from "./CashflowService";
import PriceService from "./PriceService";
import { isNewerThan } from "../utils/utiilityFunctions";
import ProfileService from "./ProfileService";

type PriceData = {
  date: string; // format: "YYYY-MM-DD"
  close: number;
};

class StatementFetchService {
  async fetchBalanceSheets(data: any) {
    const { ticker, period, limit } = data;
    const balanceSheets = await getBalanceSheets({
      ticker,
      period,
      limit,
    });

    let successCount = 0;
    let errorCount = 0;
    const totalCount = balanceSheets.length;
    for (const item of balanceSheets) {
      try {
        const { symbol: ticker, fiscalYear } = item;

        await BalanceSheetService.createBalanceSheet({
          ticker,
          fiscalYear,
          raw: item,
        });

        successCount++;
      } catch (err) {
        console.error(`Error saving this balance sheets ${item}`, err);
        errorCount++;
      }
    }

    return {
      successCount,
      errorCount,
      totalCount,
    };
  }

  async fetchIncomeStatements(data: any) {
    const { ticker, period, limit } = data;
    const incomes = await getIncomes({
      ticker,
      period,
      limit,
    });

    let successCount = 0;
    let errorCount = 0;
    const totalCount = incomes.length;
    for (const item of incomes) {
      try {
        const { symbol: ticker, fiscalYear } = item;

        await IncomeService.createIncome({
          ticker,
          fiscalYear,
          raw: item,
        });

        successCount++;
      } catch (err) {
        console.error(`Error saving this income statement ${item}`, err);
        errorCount++;
      }
    }

    return {
      successCount,
      errorCount,
      totalCount,
    };
  }

  async fetchCashflowStatements(data: any) {
    const { ticker } = data;

    const Cashflows = await getCashflows({
      ticker,
    });

    let successCount = 0;
    let errorCount = 0;
    const totalCount = Cashflows.length;
    for (const item of Cashflows) {
      try {
        const { symbol: ticker, fiscalYear } = item;

        await CashflowService.createCashflow({
          ticker,
          fiscalYear,
          raw: item,
        });

        successCount++;
      } catch (err) {
        console.error(`Error saving this Cashflow statement ${item}`, err);
        errorCount++;
      }
    }

    return {
      successCount,
      errorCount,
      totalCount,
    };
  }

  async fetchProfile(data: any) {
    const { ticker } = data;

    const Profiles = await getProfile({
      ticker,
    });

    let successCount = 0;
    let errorCount = 0;
    const totalCount = Profiles.length;
    for (const item of Profiles) {
      try {
        const {
          symbol: ticker,
          companyName,
          exchange,
          sector,
          industry,
          beta,
        } = item;

        await ProfileService.createProfile({
          ticker,
          companyName,
          exchange,
          sector,
          industry,
          beta,
          raw: item,
        });

        successCount++;
      } catch (err) {
        console.error(`Error saving this Profile ${item}`, err);
        errorCount++;
      }
    }

    return {
      successCount,
      errorCount,
      totalCount,
    };
  }

  async fetchPriceByTicker(data: any) {
    const { ticker, from, to } = data;

    const existing = await PriceService.getPriceByTicker(ticker);
    if (existing) {
      console.log(`Price data for ticker ${ticker} already exists.`);
      return "Price data already exists";
    }

    const priceData = await getPrices({
      ticker,
      from,
      to,
    });

    if (!priceData || priceData.length === 0) {
      console.error(`No price data found for ticker: ${ticker}`);
      return "No price data found";
    }

    const { averagePrices, currentPriceObj } = priceHelper(priceData);

    if (!currentPriceObj) {
      console.error(`No valid price data found for ticker: ${ticker}`);
      return "No valid price data found";
    }

    await PriceService.createPrice({
      ticker,
      price: currentPriceObj.close,
      date: currentPriceObj.date,
      averagePrices: averagePrices,
    });

    return {
      successCount: 1,
      errorCount: 0,
      totalCount: 1,
    };
  }

  async updatePriceByTicker(data: any) {
    const { ticker, from, to } = data;

    const existing = await PriceService.getPriceByTicker(ticker);
    if (!existing) {
      throw new Error(`Price data for ticker ${ticker} does not exist.`);
    }

    const priceData = await getPrices({
      ticker,
      from,
      to,
    });

    if (!priceData || priceData.length === 0) {
      console.error(`No price data found for ticker: ${ticker}`);
      return "No price data found";
    }

    const { averagePrices, currentPriceObj } = priceHelper(priceData);

    if (!currentPriceObj) {
      console.error(`No valid price data found for ticker: ${ticker}`);
      return "No valid price data found";
    }

    const updated = {
      ...existing.toObject(),
    };

    if (isNewerThan(updated.date, currentPriceObj.date)) {
      updated.price = currentPriceObj.close;
      updated.date = currentPriceObj.date;
    }

    updated.averagePrices = {
      ...updated.averagePrices,
      ...averagePrices,
    };

    await PriceService.updatePrice(ticker, updated);

    return {
      successCount: 1,
      errorCount: 0,
      totalCount: 1,
    };
  }
}

export default new StatementFetchService();

const priceHelper = (data: PriceData[]) => {
  const pricesByYear: Record<string, number[]> = {};
  let currentPriceObj: PriceData | null = null;

  for (const priceObj of data) {
    const { date, close } = priceObj;
    const year = date.split("-")[0];

    // keep latest price object
    if (!currentPriceObj || isNewerThan(currentPriceObj.date, date)) {
      currentPriceObj = { date, close };
    }

    if (!pricesByYear[year]) {
      pricesByYear[year] = [];
    }

    pricesByYear[year].push(close);
  }

  const averagePrices: Record<string, number> = {};

  for (const [year, prices] of Object.entries(pricesByYear)) {
    const averagePrice =
      prices.reduce((acc, val) => acc + val, 0) / prices.length;
    averagePrices[year] = averagePrice;
  }

  return { averagePrices, currentPriceObj };
};
