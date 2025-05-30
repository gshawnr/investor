import { Request, Response, NextFunction } from "express";
import {
  createMetric,
  getMetrics,
} from "../../../controllers/metricController";
import MetricService from "../../../services/MetricService";

jest.mock("../../../services/MetricService");

describe("MetricController", () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createMetric", () => {
    it("should call service with validated inputs and return 201", async () => {
      const req = {
        body: {
          ticker: "TSLA",
          fiscal_year: "2023",
        },
      } as Request;

      await createMetric(req, mockRes, mockNext);

      expect(MetricService.createMetric).toHaveBeenCalledWith("tsla", "2023");
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Metric creation initiated.",
      });
    });

    it("should handle invalid fiscal_year format by skipping validation", async () => {
      const req = {
        body: {
          ticker: "NFLX",
          fiscal_year: "20a3",
        },
      } as Request;

      await createMetric(req, mockRes, mockNext);

      expect(MetricService.createMetric).toHaveBeenCalledWith(
        "nflx",
        undefined
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Metric creation initiated.",
      });
    });

    it("should handle missing ticker gracefully", async () => {
      const req = {
        body: {
          fiscal_year: "2022",
        },
      } as Request;

      await createMetric(req, mockRes, mockNext);

      expect(MetricService.createMetric).toHaveBeenCalledWith(
        undefined,
        "2022"
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Metric creation initiated.",
      });
    });

    it("should call next on error", async () => {
      const error = new Error("Service failure");
      (MetricService.createMetric as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const req = {
        body: {
          ticker: "AMZN",
          fiscal_year: "2021",
        },
      } as Request;

      await createMetric(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getMetrics", () => {
    it("should fetch metrics and return them", async () => {
      const metrics = [
        {
          ticker: "tsla",
          fiscalYear: "2023",
          data: {},
        },
      ];

      const req = {
        pagination: {
          filter: { ticker: "tsla" },
          options: { limit: 5, skip: 0 },
        },
      } as unknown as Request;

      (MetricService.getMetrics as jest.Mock).mockResolvedValue(metrics);

      await getMetrics(req, mockRes, mockNext);

      expect(MetricService.getMetrics).toHaveBeenCalledWith({
        filter: { ticker: "tsla" },
        options: { limit: 5, skip: 0 },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(metrics);
    });

    it("should call next on error", async () => {
      const error = new Error("DB failure");
      (MetricService.getMetrics as jest.Mock).mockRejectedValue(error);

      const req = {
        pagination: {
          filter: {},
          options: {},
        },
      } as unknown as Request;

      await getMetrics(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
