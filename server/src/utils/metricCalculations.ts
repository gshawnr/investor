import { IIncomeRaw } from "../types/IIncome";
import { IBalanceSheetRaw } from "../types/IBalanceSheet";
import { ICashflowRaw } from "../types/ICashflow";
import { IProfile } from "../types/IProfile";

import { ICalculationContants } from "../types/ICalculationConstants";
import e from "express";

export const getDcfValuePerShare = (
  data: any,
  constants: ICalculationContants
): number => {
  try {
    const { riskFreeRate, equityRiskPremium, costOfDebt, taxRate } = constants;

    const {
      netIncome,
      beta,
      capEx,
      depreciationAndAmortization,
      longTermDebt,
      totalDebt,
      avgSharesOutstanding,
      avgStockPrice,
    } = data;

    if (netIncome < 0) {
      return 0;
    }

    // Calculate free cash flow
    const CFO = netIncome + depreciationAndAmortization;
    const FCF = CFO - capEx;

    // Calculate discount rate
    const equity = avgSharesOutstanding * avgStockPrice;
    const debt = longTermDebt || totalDebt;
    const costOfEquity = riskFreeRate + beta * equityRiskPremium;
    const WACC =
      (costOfEquity * equity) / (equity + debt) +
      (costOfDebt * (1 - taxRate) * debt) / (equity + debt);

    // Discount free cash flow to calculate intrinsic value
    const WACC_PLUS = WACC * 1.1; // add discount factor of 10%
    const terminalGrowthRate = 0.02; // Assumed terminal growth rate of 2%
    const n = 20; // number of years assuming a company remains a going concern
    const terminalFCF = FCF * Math.pow(1 + terminalGrowthRate, n);
    const terminalValue = terminalFCF / (WACC - terminalGrowthRate);
    const presentValue = terminalValue / Math.pow(1 + WACC_PLUS, n);

    // Using Gordon Grow Model theory - NOT CURRENTLY USED
    const terminalValueGordon =
      (FCF * (1 + terminalGrowthRate)) / (WACC - terminalGrowthRate);

    return avgSharesOutstanding > 0 ? presentValue / avgSharesOutstanding : 0;
  } catch (err) {
    console.log("unable to calculate dcfValuePerShare", err);
    return 0;
  }
};

export const getPriceToEarnings = (data: any): number | null => {
  const { netIncome, avgStockPrice, avgSharesOutstanding } = data;
  if (netIncome <= 0) {
    return null;
  }
  return avgStockPrice / (netIncome / avgSharesOutstanding);
};

export const getPriceToSales = (data: any): number | null => {
  const { revenue, avgStockPrice, avgSharesOutstanding } = data;
  if (revenue <= 0 || avgSharesOutstanding <= 0) {
    return null;
  }

  return avgStockPrice / (revenue / avgSharesOutstanding);
};

export const getPriceToBook = (data: any): number | null => {
  const { equity, avgStockPrice, avgSharesOutstanding } = data;
  if (equity <= 0) {
    return null;
  }

  return avgStockPrice / (equity / avgSharesOutstanding);
};

export const getReturnOnEquity = (data: any): number => {
  const { netIncome, assets, liabilities } = data;
  const equity = assets - liabilities;

  if (equity <= 0) {
    return 0;
  }
  return netIncome / equity;
};

export const getSalesToEquity = (data: any): number => {
  const { revenue, assets, liabilities } = data;
  const equity = assets - liabilities;

  if (equity <= 0) {
    return 0;
  }
  return revenue / equity;
};

export const getGrossMargin = (data: any): number => {
  const { grossProfit, revenue } = data;
  if (revenue == 0) {
    return 0; // Avoid division by zero
  }
  return grossProfit / revenue;
};

export const getNetMargin = (data: any): number => {
  const { revenue, netIncome } = data;
  if (revenue == 0) {
    return 0; // Avoid division by zero
  }
  return netIncome / revenue;
};

export const getDebtToEquity = (data: any): number | null => {
  const { assets, liabilities } = data;

  const equity = assets - liabilities;
  if (equity <= 0) {
    return null;
  }

  return liabilities / (assets - liabilities);
};

export const getDebtToEbitda = (data: any): number | null => {
  const { ebitda, totalDebt } = data;

  if (ebitda <= 0) {
    return null;
  }

  return totalDebt / ebitda;
};

export const getCurrentRatio = (data: any): number => {
  const { currentAssets, currentLiabilities } = data;
  if (currentLiabilities === 0) {
    return 1;
  }
  return currentAssets / currentLiabilities;
};

// Helper functions to calculate performance data
export function getPerfromanceData(
  incomeRaw: IIncomeRaw,
  balanceRaw: IBalanceSheetRaw
): {
  returnOnEquity: number;
  salesToEquity: number;
} {
  const { netIncome, revenue } = incomeRaw;
  const { totalAssets: assets, totalLiabilities: liabilities } = balanceRaw;

  const returnOnEquity = getReturnOnEquity({ netIncome, assets, liabilities });
  const salesToEquity = getSalesToEquity({ revenue, assets, liabilities });

  return {
    returnOnEquity,
    salesToEquity,
  };
}

export function getProfitabilityData(incomeRaw: IIncomeRaw): {
  grossMargin: number;
  netMargin: number;
} {
  const grossMargin = getGrossMargin(incomeRaw);
  const netMargin = getNetMargin(incomeRaw);

  return {
    grossMargin,
    netMargin,
  };
}

export function getStabilityData(
  balanceRaw: IBalanceSheetRaw,
  incomeRaw: IIncomeRaw
): {
  debtToEquity: number | null;
  debtToEbitda: number | null;
  currentRatio: number;
} {
  const {
    totalAssets: assets,
    totalCurrentAssets: currentAssets,
    totalCurrentLiabilities: currentLiabilities,
    totalLiabilities: liabilities,
    totalDebt,
  } = balanceRaw;

  const { ebitda } = incomeRaw;

  const debtToEquity = getDebtToEquity({ assets, liabilities });
  const debtToEbitda = getDebtToEbitda({ totalDebt, ebitda });
  const currentRatio = getCurrentRatio({ currentAssets, currentLiabilities });

  return {
    debtToEquity,
    debtToEbitda,
    currentRatio,
  };
}

export function getValueData(
  incomeRaw: IIncomeRaw,
  avgPriceByYear: number,
  profile: IProfile,
  cashflowRaw: ICashflowRaw,
  balsheetRaw: IBalanceSheetRaw,
  calculationConstants: ICalculationContants
): {
  dcfToAvgPrice: number;
  dcfValuePerShare: number;
  priceToEarnings: number | null;
  earningsYield: number | null;
  priceToSales: number | null;
  priceToBook: number | null;
} {
  const {
    revenue,
    netIncome,
    weightedAverageShsOut: avgSharesOutstanding,
  } = incomeRaw;
  const { beta } = profile;
  const { longTermDebt, totalDebt, totalEquity: equity } = balsheetRaw;
  const { capitalExpenditure: capEx, depreciationAndAmortization } =
    cashflowRaw;

  const dcfValuePerShare = getDcfValuePerShare(
    {
      netIncome,
      beta,
      capEx,
      depreciationAndAmortization,
      longTermDebt,
      totalDebt,
      avgSharesOutstanding,
      avgStockPrice: avgPriceByYear,
    },
    calculationConstants
  );

  const dcfToAvgPrice = dcfValuePerShare / avgPriceByYear;

  const priceToEarnings = getPriceToEarnings({
    netIncome,
    avgStockPrice: avgPriceByYear,
    avgSharesOutstanding,
  });

  const earningsYield = priceToEarnings ? 1 / priceToEarnings : null;

  const priceToSales = getPriceToSales({
    revenue,
    avgStockPrice: avgPriceByYear,
    avgSharesOutstanding,
  });

  const priceToBook = getPriceToBook({
    equity,
    avgStockPrice: avgPriceByYear,
    avgSharesOutstanding,
  });

  return {
    dcfToAvgPrice,
    dcfValuePerShare,
    priceToEarnings,
    earningsYield,
    priceToSales,
    priceToBook,
  };
}
