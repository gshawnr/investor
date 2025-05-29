import Metric from "../../../models/Metric";
import MetricService from "../../../services/MetricService";
import MetricGeneratorService from "../../../services/MetricGeneratorService";

jest.mock("../../../models/Metric");
jest.mock("../../../services/MetricGeneratorService");

describe("MetricService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createMetric", () => {
    it("should call MetricGeneratorService.createMetrics with correct args", async () => {
      const mockCreate = jest.fn();
      (MetricGeneratorService.createMetrics as jest.Mock) = mockCreate;

      await MetricService.createMetric("AAPL", "2024");

      expect(mockCreate).toHaveBeenCalledWith("AAPL", "2024");
    });
  });

  describe("getMetrics", () => {
    it("should return all metrics", async () => {
      const mockMetrics = [
        { ticker: "aapl", fiscalYear: "2023" },
        { ticker: "aapl", fiscalYear: "2024" },
      ];
      (Metric.find as jest.Mock).mockResolvedValue(mockMetrics);

      const res = await MetricService.getMetrics();

      expect(Metric.find).toHaveBeenCalledWith({});
      expect(res).toEqual(mockMetrics);
    });
  });

  describe("getMetricByTickerYear", () => {
    it("should return the correct metric", async () => {
      const mockMetric = {
        ticker: "aapl",
        fiscalYear: "2024",
        ticker_year: "aapl_2024",
      };
      (Metric.findOne as jest.Mock).mockResolvedValue(mockMetric);

      const res = await MetricService.getMetricByTickerYear("AAPL", "2024");

      expect(Metric.findOne).toHaveBeenCalledWith({ ticker_year: "aapl_2024" });
      expect(res).toEqual(mockMetric);
    });
  });

  describe("updateMetric", () => {
    it("should update and return the metric", async () => {
      const updates = {
        profitabilityData: { grossMargin: 0.35, netMargin: 0.09 },
      };
      const mockUpdated = {
        ticker: "aapl",
        fiscalYear: "2024",
        profitabilityData: updates.profitabilityData,
      };

      (Metric.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdated);

      const res = await MetricService.updateMetric("AAPL", "2024", updates);

      expect(Metric.findOneAndUpdate).toHaveBeenCalledWith(
        { ticker_year: "aapl_2024" },
        { $set: updates },
        { new: true, runValidators: true }
      );
      expect(res).toEqual(mockUpdated);
    });
  });

  describe("deleteMetric", () => {
    it("should delete and return the metric", async () => {
      const mockDeleted = { ticker: "aapl", fiscalYear: "2023" };

      (Metric.findOneAndDelete as jest.Mock).mockResolvedValue(mockDeleted);

      const res = await MetricService.deleteMetric("AAPL", "2023");

      expect(Metric.findOneAndDelete).toHaveBeenCalledWith({
        ticker_year: "aapl_2023",
      });
      expect(res).toEqual(mockDeleted);
    });
  });
});
