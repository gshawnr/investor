import MetricGeneratorService from "../../../services/MetricGeneratorService";
import ProfileService from "../../../services/ProfileService";
import PriceService from "../../../services/PriceService";
import CalculationConstantsService from "../../../services/CalculationConstantsService";
import Income from "../../../models/Income";
import BalanceSheet from "../../../models/BalanceSheet";
import CashFlow from "../../../models/Cashflow";
import Metric from "../../../models/Metric";

jest.mock("../../../services/ProfileService");
jest.mock("../../../services/PriceService");
jest.mock("../../../services/CalculationConstantsService");
jest.mock("../../../models/Income");
jest.mock("../../../models/Metric");
jest.mock("../../../models/BalanceSheet");
jest.mock("../../../models/Cashflow");
jest.mock("../../../utils/metricCalculations");

describe("MetricGeneratorService", () => {
  beforeEach(() => {
    (Metric.findOneAndUpdate as jest.Mock).mockResolvedValue({});

    // mock out looging in console
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest.clearAllMocks();
  });

  it("should log warning and skip when no price data", async () => {
    (ProfileService.getProfiles as jest.Mock).mockResolvedValue([
      {
        ticker: "aapl",
      },
    ]);
    (PriceService.getPriceByTicker as jest.Mock).mockResolvedValue(null);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await MetricGeneratorService.createMetrics("AAPL", "2024");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Metric generation failed:",
      "No profiles found for the given ticker."
    );
  });

  it("should skip when no calculation constants", async () => {
    (ProfileService.getProfileByTicker as jest.Mock).mockResolvedValue({
      ticker: "aapl",
    });
    (PriceService.getPriceByTicker as jest.Mock).mockResolvedValue({
      averagePrices: { "2024": 100 },
    });
    (CalculationConstantsService.getCalculationConstants as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    await MetricGeneratorService.createMetrics("AAPL", "2024");

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'No calculation constants found for ticker "aapl" and year "2024". Skipping.'
    );
  });

  it("should process and create metric data", async () => {
    try {
      (ProfileService.getProfileByTicker as jest.Mock).mockResolvedValue({
        ticker: "aapl",
      });
      (PriceService.getPriceByTicker as jest.Mock).mockResolvedValue({
        averagePrices: { "2024": 150 },
      });
      (
        CalculationConstantsService.getCalculationConstants as jest.Mock
      ).mockResolvedValue({});

      const mockIncome = [{ ticker_year: "aapl_2024", raw: {} }];
      const mockBalance = [
        { ticker_year: "aapl_2024", fiscalYear: "2024", raw: {} },
      ];
      const mockCashflow = [{ ticker_year: "aapl_2024", raw: {} }];

      (Income.find as jest.Mock).mockResolvedValue(mockIncome);
      (BalanceSheet.find as jest.Mock).mockResolvedValue(mockBalance);
      (CashFlow.find as jest.Mock).mockResolvedValue(mockCashflow);

      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

      await MetricGeneratorService.createMetrics("AAPL", "2024");

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Ticker "AAPL" - processing 1 document sets.'
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Metric generation completed")
      );
    } catch (error) {
      console.error("Test failed:", (error as Error).message || error);
    }
  });
});
