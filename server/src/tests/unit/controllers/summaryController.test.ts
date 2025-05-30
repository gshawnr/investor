import { Request, Response, NextFunction } from "express";
import SummaryController from "../../../controllers/summaryController";
import SummaryService from "../../../services/SummaryService";
import { ISummary } from "../../../types/ISummary";

jest.mock("../../../services/SummaryService");

describe("summaryController", () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createSummary", () => {
    it("should call service with validated inputs and return 201", async () => {
      const req = {
        body: {
          ticker: "AAPL",
          fiscal_year: "2024",
        },
      } as Request;

      await SummaryController.createSummary(req, mockRes, mockNext);

      expect(SummaryService.createSummaries).toHaveBeenCalledWith(
        "aapl",
        "2024"
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Summary creation initiated.",
      });
    });

    it("should handle invalid year format by skipping validation", async () => {
      const req = {
        body: {
          ticker: "MSFT",
          fiscal_year: "20ab",
        },
      } as Request;

      await SummaryController.createSummary(req, mockRes, mockNext);

      expect(SummaryService.createSummaries).toHaveBeenCalledWith(
        "msft",
        undefined
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Summary creation initiated.",
      });
    });

    it("should call next on error", async () => {
      const error = new Error("Unexpected failure");
      (SummaryService.createSummaries as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const req = {
        body: {
          ticker: "GOOG",
          fiscal_year: "2023",
        },
      } as Request;

      await SummaryController.createSummary(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getSummaries", () => {
    it("should fetch summaries and return them", async () => {
      const summaries = [
        {
          ticker: "aapl",
          fiscalYear: "2024",
          data: {},
        },
      ];

      const req = {
        pagination: {
          filter: { ticker: "aapl" },
          options: { limit: 10, skip: 0 },
        },
      } as unknown as Request;

      (SummaryService.getSummaries as jest.Mock).mockResolvedValue(summaries);

      await SummaryController.getSummaries(req, mockRes, mockNext);

      expect(SummaryService.getSummaries).toHaveBeenCalledWith({
        filter: { ticker: "aapl" },
        options: { limit: 10, skip: 0 },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(summaries);
    });

    it("should call next on error", async () => {
      const error = new Error("DB error");
      (SummaryService.getSummaries as jest.Mock).mockRejectedValue(error);

      const req = {
        pagination: {
          filter: {},
          options: {},
        },
      } as unknown as Request;

      await SummaryController.getSummaries(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
