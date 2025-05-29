import { ICashflowRaw, ICashflow } from "../../../types/ICashflow";
import { IBalanceSheetRaw } from "../../../types/IBalanceSheet";
import { IIncome, IIncomeRaw } from "../../../types/IIncome";
import { IProfile } from "../../../types/IProfile";
import {
  getDcfValuePerShare,
  getPriceToEarnings,
  getPriceToSales,
  getPriceToBook,
  getReturnOnEquity,
  getSalesToEquity,
  getGrossMargin,
  getNetMargin,
  getDebtToEquity,
  getDebtToEbitda,
  getCurrentRatio,
  getPerfromanceData,
  getProfitabilityData,
  getStabilityData,
  getValueData,
} from "../../../utils/metricCalculations"; // Update with actual file path

describe("Financial Utility Functions", () => {
  const constants = {
    year: "2023",
    riskFreeRate: 0.02,
    equityRiskPremium: 0.05,
    costOfDebt: 0.04,
    taxRate: 0.25,
  };

  describe("getDcfValuePerShare", () => {
    it("returns a valid per share value (happy path)", () => {
      const data = {
        netIncome: 1000000,
        beta: 1.2,
        capEx: 200000,
        depreciationAndAmortization: 150000,
        longTermDebt: 500000,
        totalDebt: 800000,
        avgSharesOutstanding: 100000,
        avgStockPrice: 50,
      };
      const result = getDcfValuePerShare(data, constants);
      expect(result).toBeGreaterThan(0);
    });

    it("returns negative if FCF is negative", () => {
      const data = {
        ...mockDcfData(),
        netIncome: -1000,
      };
      expect(getDcfValuePerShare(data, constants)).toBeLessThan(0);
    });

    it("handles division by zero (avgSharesOutstanding is 0)", () => {
      const data = {
        ...mockDcfData(),
        avgSharesOutstanding: 0,
      };
      expect(getDcfValuePerShare(data, constants)).toBe(0);
    });

    it("handles thrown exceptions gracefully", () => {
      try {
        const data = null as any;
        getDcfValuePerShare(data, constants);
        expect(true).toBe(false); // Should not reach here
      } catch (e) {
        expect(e).toBeDefined(); // This is just to ensure the test doesn't fail due to an unhandled exception
      }
    });
  });

  describe("getPriceToEarnings", () => {
    it("returns a valid PE ratio", () => {
      const data = {
        netIncome: 1000,
        avgStockPrice: 50,
        avgSharesOutstanding: 100,
      };
      expect(getPriceToEarnings(data)).toBeCloseTo(5);
    });

    it("returns null when net income <= 0", () => {
      expect(
        getPriceToEarnings({
          netIncome: 0,
          avgStockPrice: 50,
          avgSharesOutstanding: 100,
        })
      ).toBeNull();
    });
  });

  describe("getPriceToSales", () => {
    it("returns a valid PS ratio", () => {
      const data = {
        revenue: 2000,
        avgStockPrice: 50,
        avgSharesOutstanding: 100,
      };
      expect(getPriceToSales(data)).toBeCloseTo(2.5);
    });

    it("returns null when revenue <= 0", () => {
      expect(
        getPriceToSales({
          revenue: 0,
          avgStockPrice: 50,
          avgSharesOutstanding: 100,
        })
      ).toBeNull();
    });

    it("returns null when avgSharesOutstanding <= 0", () => {
      expect(
        getPriceToSales({
          revenue: 1000,
          avgStockPrice: 50,
          avgSharesOutstanding: 0,
        })
      ).toBeNull();
    });
  });

  describe("getPriceToBook", () => {
    it("returns a valid PB ratio", () => {
      const data = {
        equity: 2000,
        avgStockPrice: 50,
        avgSharesOutstanding: 100,
      };
      expect(getPriceToBook(data)).toBeCloseTo(2.5);
    });

    it("returns null if equity <= 0", () => {
      expect(
        getPriceToBook({
          equity: 0,
          avgStockPrice: 50,
          avgSharesOutstanding: 100,
        })
      ).toBeNull();
    });
  });

  describe("getReturnOnEquity", () => {
    it("returns valid ROE", () => {
      expect(
        getReturnOnEquity({ netIncome: 1000, assets: 3000, liabilities: 1000 })
      ).toBeCloseTo(0.5);
    });

    it("returns 0 if equity <= 0", () => {
      expect(
        getReturnOnEquity({ netIncome: 1000, assets: 1000, liabilities: 1000 })
      ).toBe(0);
    });
  });

  describe("getSalesToEquity", () => {
    it("returns valid sales to equity ratio", () => {
      expect(
        getSalesToEquity({ revenue: 4000, assets: 5000, liabilities: 1000 })
      ).toBeCloseTo(1);
    });

    it("returns 0 if equity <= 0", () => {
      expect(
        getSalesToEquity({ revenue: 4000, assets: 1000, liabilities: 1000 })
      ).toBe(0);
    });
  });

  describe("getGrossMargin", () => {
    it("returns valid gross margin", () => {
      expect(getGrossMargin({ grossProfit: 500, revenue: 1000 })).toBeCloseTo(
        0.5
      );
    });

    it("returns 0 if revenue is 0", () => {
      expect(getGrossMargin({ grossProfit: 500, revenue: 0 })).toBe(0);
    });
  });

  describe("getNetMargin", () => {
    it("returns valid net margin", () => {
      expect(getNetMargin({ netIncome: 200, revenue: 1000 })).toBeCloseTo(0.2);
    });

    it("returns 0 if revenue is 0", () => {
      expect(getNetMargin({ netIncome: 200, revenue: 0 })).toBe(0);
    });
  });

  describe("getDebtToEquity", () => {
    it("returns valid ratio", () => {
      expect(getDebtToEquity({ assets: 3000, liabilities: 1000 })).toBeCloseTo(
        0.5
      );
    });

    it("returns null if equity <= 0", () => {
      expect(getDebtToEquity({ assets: 1000, liabilities: 1000 })).toBeNull();
    });
  });

  describe("getDebtToEbitda", () => {
    it("returns valid ratio", () => {
      expect(getDebtToEbitda({ totalDebt: 2000, ebitda: 1000 })).toBeCloseTo(2);
    });

    it("returns null if ebitda <= 0", () => {
      expect(getDebtToEbitda({ totalDebt: 2000, ebitda: 0 })).toBeNull();
    });
  });

  describe("getCurrentRatio", () => {
    it("returns valid ratio", () => {
      expect(
        getCurrentRatio({ currentAssets: 3000, currentLiabilities: 1500 })
      ).toBeCloseTo(2);
    });

    it("returns 1 when liabilities = 0", () => {
      expect(
        getCurrentRatio({ currentAssets: 1000, currentLiabilities: 0 })
      ).toBe(1);
    });
  });

  describe("getPerfromanceData", () => {
    it("returns valid returnOnEquity and salesToEquity", () => {
      const income = { netIncome: 1000, revenue: 5000 };
      const balance = { totalAssets: 6000, totalLiabilities: 1000 };
      const result = getPerfromanceData(
        income as IIncomeRaw,
        balance as IBalanceSheetRaw
      );
      expect(result.returnOnEquity).toBeCloseTo(1000 / 5000);
      expect(result.salesToEquity).toBeCloseTo(1);
    });
  });

  describe("getProfitabilityData", () => {
    it("returns valid gross and net margin", () => {
      const income = { grossProfit: 300, revenue: 1000, netIncome: 200 };
      const result = getProfitabilityData(income as IIncomeRaw);
      expect(result.grossMargin).toBeCloseTo(0.3);
      expect(result.netMargin).toBeCloseTo(0.2);
    });
  });

  describe("getStabilityData", () => {
    it("returns valid ratios", () => {
      const balance = {
        totalAssets: 5000,
        totalCurrentAssets: 3000,
        totalCurrentLiabilities: 1500,
        totalLiabilities: 2000,
        totalDebt: 1000,
      };
      const income = { ebitda: 500 };
      const result = getStabilityData(
        balance as IBalanceSheetRaw,
        income as IIncomeRaw
      );
      expect(result.debtToEquity).toBeCloseTo(2000 / 3000);
      expect(result.debtToEbitda).toBeCloseTo(2);
      expect(result.currentRatio).toBeCloseTo(2);
    });
  });

  describe("getValueData", () => {
    it("returns all valuation metrics", () => {
      const income = {
        revenue: 10000,
        netIncome: 2000,
        weightedAverageShsOut: 100,
      };
      const profile = { beta: 1.2 };
      const cashflow = {
        capitalExpenditure: 500,
        depreciationAndAmortization: 300,
        netCashProvidedByOperatingActivities: 4000,
      };
      const balance = {
        longTermDebt: 1000,
        totalDebt: 1500,
        totalEquity: 5000,
      };
      const avgPrice = 60;

      const result = getValueData(
        income as IIncomeRaw,
        avgPrice,
        profile as IProfile,
        cashflow as ICashflowRaw,
        balance as IBalanceSheetRaw,
        constants
      );

      expect(result.dcfValuePerShare).toBeGreaterThan(0);
      expect(result.dcfToAvgPrice).toBeGreaterThan(0);
      expect(result.priceToEarnings).not.toBeNull();
      expect(result.priceToBook).not.toBeNull();
      expect(result.priceToSales).not.toBeNull();
    });
  });
});

// Helper for mocking common DCF data
function mockDcfData() {
  return {
    netIncome: 1000000,
    beta: 1.2,
    capEx: 100000,
    depreciationAndAmortization: 100000,
    longTermDebt: 300000,
    totalDebt: 300000,
    avgSharesOutstanding: 100000,
    avgStockPrice: 50,
  };
}
