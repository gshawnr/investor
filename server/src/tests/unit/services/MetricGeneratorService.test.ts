import MetricGeneratorService from "../../../services/MetricGeneratorService";
import ProfileService from "../../../services/ProfileService";
import PriceService from "../../../services/PriceService";
import Income from "../../../models/Income";
import BalanceSheet from "../../../models/BalanceSheet";
import CashFlow from "../../../models/Cashflow";
import Metric from "../../../models/Metric";
import TickerYear from "../../../models/TickerYear";
import CalculationConstantsService from "../../../services/CalculationConstantsService";
import * as metricCalculations from "../../../utils/metricCalculations";

jest.mock("../../../services/ProfileService");
jest.mock("../../../services/PriceService");
jest.mock("../../../models/Income");
jest.mock("../../../models/BalanceSheet");
jest.mock("../../../models/Cashflow");
jest.mock("../../../models/Metric");
jest.mock("../../../models/TickerYear");
jest.mock("../../../services/CalculationConstantsService");

jest.mock("../../../utils/metricCalculations", () => ({
  getPerfromanceData: jest.fn(() => ({})),
  getProfitabilityData: jest.fn(() => ({})),
  getStabilityData: jest.fn(() => ({})),
  getValueData: jest.fn(() => ({})),
}));

describe("MetricGeneratorService", () => {
  let profileServiceMock: jest.Mocked<typeof ProfileService>;
  let priceServiceMock: jest.Mocked<typeof PriceService>;
  let incomeMock: jest.Mocked<typeof Income>;
  let balanceMock: jest.Mocked<typeof BalanceSheet>;
  let cashflowMock: jest.Mocked<typeof CashFlow>;
  let metricMock: jest.Mocked<typeof Metric>;
  let tickerYearMock: jest.Mocked<typeof TickerYear>;
  let calculationConstantsServiceMock: jest.Mocked<
    typeof CalculationConstantsService
  >;

  beforeEach(() => {
    profileServiceMock = ProfileService as jest.Mocked<typeof ProfileService>;
    priceServiceMock = PriceService as jest.Mocked<typeof PriceService>;
    incomeMock = Income as jest.Mocked<typeof Income>;
    balanceMock = BalanceSheet as jest.Mocked<typeof BalanceSheet>;
    cashflowMock = CashFlow as jest.Mocked<typeof CashFlow>;
    metricMock = Metric as jest.Mocked<typeof Metric>;
    tickerYearMock = TickerYear as jest.Mocked<typeof TickerYear>;
    calculationConstantsServiceMock =
      CalculationConstantsService as jest.Mocked<
        typeof CalculationConstantsService
      >;

    // (Metric.findOneAndUpdate as jest.Mock).mockResolvedValue({});
    // mock out looging in console
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest.clearAllMocks();
  });

  describe("createMetrics", () => {
    it("should create metrics for profiles with price and docs", async () => {
      const ticker = "AAPL";
      const year = "2024";

      // Mock profiles found
      const profiles = [
        { ticker: "aapl", beta: 1.2, industry: "Tech", sector: "Technology" },
      ];

      profileServiceMock.getProfileByTicker.mockResolvedValue(
        profiles[0] as any
      );

      const calcConstants = [
        {
          year: "2024",
          riskFreeRate: 0.03,
          equityRiskPremium: 0.05,
          costOfDebt: 0.04,
          taxRate: 0.21,
        },
      ];
      calculationConstantsServiceMock.getCalculationConstants.mockResolvedValue(
        calcConstants as any
      );

      // Mock price returned for ticker
      const priceData = {
        averagePrices: {
          "2024": 150,
        },
      };
      priceServiceMock.getPriceByTicker.mockResolvedValue(priceData as any);

      // Mock Income, BalanceSheet, CashFlow documents for ticker/year
      const incomeDocs = [
        {
          ticker_year: "aapl_2024",
          fiscalYear: "2024",
          raw: {
            weightedAverageShsOut: 1000,
            weightedAverageShsOutDil: 1100,
            costOfRevenue: 200,
            depreciationAndAmortization: 50,
            ebitda: 300,
            eps: 2,
            epsDiluted: 2.1,
            grossProfit: 400,
            netIncome: 150,
            operatingExpenses: 100,
            operatingIncome: 120,
            revenue: 500,
          },
        },
      ];
      const balanceDocs = [
        {
          ticker_year: "aapl_2024",
          fiscalYear: "2024",
          raw: {
            totalAssets: 10000,
            reportedCurrency: "USD",
            totalCurrentAssets: 5000,
            totalCurrentLiabilities: 2000,
            totalEquity: 6000,
            totalLiabilities: 4000,
            longTermDebt: 1000,
            totalDebt: 1500,
          },
        },
      ];
      const cashflowDocs = [
        {
          ticker_year: "aapl_2024",
          raw: {
            capitalExpenditure: 100,
            netCashProvidedByOperatingActivities: 250,
          },
        },
      ];

      const tickerYearDoc = {
        ticker_year: "aapl_2024",
        year: "2024",
        ticker: "aapl",
        hasSummary: false,
      };

      incomeMock.find.mockResolvedValue(incomeDocs as any);
      balanceMock.find.mockResolvedValue(balanceDocs as any);
      cashflowMock.find.mockResolvedValue(cashflowDocs as any);
      tickerYearMock.findOneAndUpdate.mockResolvedValue(tickerYearDoc as any);

      // Mock Summary upsert result
      const updatedMetric = {
        ticker: "aapl",
        fiscalYear: "2024",
        ticker_year: "aapl_2024",
        // add more
      };
      metricMock.findOneAndUpdate.mockResolvedValue(updatedMetric as any);

      await MetricGeneratorService.createMetrics(ticker, year);

      expect(profileServiceMock.getProfileByTicker).toHaveBeenCalledWith(
        ticker
      );
      expect(priceServiceMock.getPriceByTicker).toHaveBeenCalledWith(
        ticker.toLowerCase()
      );
      expect(incomeMock.find).toHaveBeenCalledWith({
        ticker_year: `${ticker.toLowerCase()}_${year}`,
      });
      expect(balanceMock.find).toHaveBeenCalledWith({
        ticker_year: `${ticker.toLowerCase()}_${year}`,
      });
      expect(cashflowMock.find).toHaveBeenCalledWith({
        ticker_year: `${ticker.toLowerCase()}_${year}`,
      });
      expect(metricMock.findOneAndUpdate).toHaveBeenCalledWith(
        { ticker_year: "aapl_2024" },
        expect.objectContaining({
          ticker: "aapl",
          fiscalYear: "2024",
        }),
        { upsert: true, new: true }
      );
      expect(tickerYearMock.findOneAndUpdate).toHaveBeenCalledWith(
        {
          ticker_year: "aapl_2024",
        },
        {
          $set: {
            ticker_year: "aapl_2024",
            ticker: "aapl",
            year: "2024",
            hasMetric: true,
          },
        },
        { runValidators: true, upsert: true, new: true }
      );
    });

    it("should skip metric generation if price data not found", async () => {
      const ticker = "AAPL";

      // profileMock.find.mockResolvedValue([{ ticker: "aapl" }] as any);
      priceServiceMock.getPriceByTicker.mockResolvedValue(null);

      const consoleWarnSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      await MetricGeneratorService.createMetrics(ticker);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `No price data found for ticker "aapl". Skipping.`
      );

      consoleWarnSpy.mockRestore();
    });

    it("should handle errors gracefully and log", async () => {
      // profileMock.find.mockRejectedValue(new Error("DB error"));

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await MetricGeneratorService.createMetrics();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Metric generation failed:",
        "No profiles found for the given ticker."
      );

      consoleErrorSpy.mockRestore();
    });
  });
  // it("should log warning and skip when no price data", async () => {
  //   (ProfileService.getProfiles as jest.Mock).mockResolvedValue([
  //     {
  //       ticker: "aapl",
  //     },
  //   ]);
  //   (PriceService.getPriceByTicker as jest.Mock).mockResolvedValue(null);

  //   const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

  //   await MetricGeneratorService.createMetrics("AAPL", "2024");

  //   expect(consoleErrorSpy).toHaveBeenCalledWith(
  //     "Metric generation failed:",
  //     "No profiles found for the given ticker."
  //   );
  // });

  // it("should skip when no calculation constants", async () => {
  //   (ProfileService.getProfileByTicker as jest.Mock).mockResolvedValue({
  //     ticker: "aapl",
  //   });
  //   (PriceService.getPriceByTicker as jest.Mock).mockResolvedValue({
  //     averagePrices: { "2024": 100 },
  //   });
  //   (CalculationConstantsService.getCalculationConstants as jest.Mock)
  //     .mockResolvedValueOnce(null)
  //     .mockResolvedValueOnce(null);

  //   const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

  //   await MetricGeneratorService.createMetrics("AAPL", "2024");

  //   expect(consoleWarnSpy).toHaveBeenCalledWith(
  //     'No calculation constants found for ticker "aapl" and year "2024". Skipping.'
  //   );
  // });

  // it("should process and create metric data", async () => {
  //   try {
  //     (ProfileService.getProfileByTicker as jest.Mock).mockResolvedValue({
  //       ticker: "aapl",
  //     });
  //     (PriceService.getPriceByTicker as jest.Mock).mockResolvedValue({
  //       averagePrices: { "2024": 150 },
  //     });
  //     (
  //       CalculationConstantsService.getCalculationConstants as jest.Mock
  //     ).mockResolvedValue({});

  //     const mockIncome = [{ ticker_year: "aapl_2024", raw: {} }];
  //     const mockBalance = [
  //       { ticker_year: "aapl_2024", fiscalYear: "2024", raw: {} },
  //     ];
  //     const mockCashflow = [{ ticker_year: "aapl_2024", raw: {} }];

  //     (Income.find as jest.Mock).mockResolvedValue(mockIncome);
  //     (BalanceSheet.find as jest.Mock).mockResolvedValue(mockBalance);
  //     (CashFlow.find as jest.Mock).mockResolvedValue(mockCashflow);

  //     const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

  //     await MetricGeneratorService.createMetrics("AAPL", "2024");

  //     expect(consoleLogSpy).toHaveBeenCalledWith(
  //       'Ticker "AAPL" - processing 1 document sets.'
  //     );
  //     expect(consoleLogSpy).toHaveBeenCalledWith(
  //       expect.stringContaining("Metric generation completed")
  //     );
  //   } catch (error) {
  //     console.error("Test failed:", (error as Error).message || error);
  //   }
  // });
});
