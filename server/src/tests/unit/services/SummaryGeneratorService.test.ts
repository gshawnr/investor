import SummaryGeneratorService from "../../../services/SummaryGeneratorService";
import Profile from "../../../models/Profile";
import PriceService from "../../../services/PriceService";
import IncomeStatement from "../../../models/Income";
import BalanceSheet from "../../../models/BalanceSheet";
import CashFlow from "../../../models/Cashflow";
import Summary from "../../../models/Summary";

jest.mock("../../../models/Profile");
jest.mock("../../../services/PriceService");
jest.mock("../../../models/Income");
jest.mock("../../../models/BalanceSheet");
jest.mock("../../../models/Cashflow");
jest.mock("../../../models/Summary");

describe("SummaryGeneratorService", () => {
  let profileMock: jest.Mocked<typeof Profile>;
  let priceServiceMock: jest.Mocked<typeof PriceService>;
  let incomeMock: jest.Mocked<typeof IncomeStatement>;
  let balanceMock: jest.Mocked<typeof BalanceSheet>;
  let cashflowMock: jest.Mocked<typeof CashFlow>;
  let summaryMock: jest.Mocked<typeof Summary>;

  beforeEach(() => {
    profileMock = Profile as jest.Mocked<typeof Profile>;
    priceServiceMock = PriceService as jest.Mocked<typeof PriceService>;
    incomeMock = IncomeStatement as jest.Mocked<typeof IncomeStatement>;
    balanceMock = BalanceSheet as jest.Mocked<typeof BalanceSheet>;
    cashflowMock = CashFlow as jest.Mocked<typeof CashFlow>;
    summaryMock = Summary as jest.Mocked<typeof Summary>;

    // mock out looging in console
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest.clearAllMocks();
  });

  describe("createSummaries", () => {
    it("should create summaries for profiles with price and docs", async () => {
      const ticker = "AAPL";
      const year = "2024";

      // Mock profiles found
      const profiles = [
        { ticker: "aapl", beta: 1.2, industry: "Tech", sector: "Technology" },
      ];
      profileMock.find.mockResolvedValue(profiles as any);

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

      incomeMock.find.mockResolvedValue(incomeDocs as any);
      balanceMock.find.mockResolvedValue(balanceDocs as any);
      cashflowMock.find.mockResolvedValue(cashflowDocs as any);

      // Mock Summary upsert result
      const updatedSummary = {
        ticker: "aapl",
        fiscalYear: "2024",
        ticker_year: "aapl_2024",
        beta: 1.2,
        industry: "Tech",
        sector: "Technology",
        assets: 10000,
        currency: "USD",
        currentAssets: 5000,
        currentLiabilities: 2000,
        equity: 6000,
        liabilities: 4000,
        longTermDebt: 1000,
        totalDebt: 1500,
        avgSharesOutstanding: 1000,
        avgSharesOutstandingDiluted: 1100,
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
        capEx: 100,
        cashflowFromOps: 250,
      };
      summaryMock.findOneAndUpdate.mockResolvedValue(updatedSummary as any);

      await SummaryGeneratorService.createSummaries(ticker, year);

      expect(profileMock.find).toHaveBeenCalledWith({
        ticker: ticker.toLowerCase(),
      });
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
      expect(summaryMock.findOneAndUpdate).toHaveBeenCalledWith(
        { ticker_year: "aapl_2024" },
        expect.objectContaining({
          ticker: "aapl",
          fiscalYear: "2024",
        }),
        { upsert: true, new: true }
      );
    });

    it("should skip summary generation if price data not found", async () => {
      const ticker = "AAPL";

      profileMock.find.mockResolvedValue([{ ticker: "aapl" }] as any);
      priceServiceMock.getPriceByTicker.mockResolvedValue(null);

      const consoleWarnSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      await SummaryGeneratorService.createSummaries(ticker);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `No price data found for ticker "aapl". Skipping.`
      );

      consoleWarnSpy.mockRestore();
    });

    it("should handle errors gracefully and log", async () => {
      profileMock.find.mockRejectedValue(new Error("DB error"));

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await SummaryGeneratorService.createSummaries();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Summary generation failed:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
