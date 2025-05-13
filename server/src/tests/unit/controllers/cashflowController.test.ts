import CashFlowController from "../../../controllers/cashflowController";
import CashFlowService from "../../../services/CashflowService";
import { Request, Response, NextFunction } from "express";

jest.mock("../../../services/CashflowService");

describe("CashFlowController", () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCashFlow", () => {
    it("should create a cash flow and return 201", async () => {
      const mockData = { ticker: "aapl", year: "2024", cash: 5000 };
      (CashFlowService.createCashFlow as jest.Mock).mockResolvedValue(mockData);

      mockReq.body = mockData;

      await CashFlowController.createCashFlow(mockReq, mockRes, mockNext);

      expect(CashFlowService.createCashFlow).toHaveBeenCalledWith(mockData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });

    it("should call next on error", async () => {
      const error = new Error("Test error");
      (CashFlowService.createCashFlow as jest.Mock).mockRejectedValue(error);

      await CashFlowController.createCashFlow(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getCashFlow", () => {
    it("should return 400 if year is invalid", async () => {
      mockReq.params = { ticker: "AAPL" };
      mockReq.query = { year: "20xx" };

      await CashFlowController.getCashFlow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid year format",
      });
    });

    it("should return 404 if no result found for year", async () => {
      mockReq.params = { ticker: "AAPL" };
      mockReq.query = { year: "2023" };
      (CashFlowService.getCashFlowByTickerYear as jest.Mock).mockResolvedValue(
        null
      );

      await CashFlowController.getCashFlow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "cashflow not found",
      });
    });

    it("should return result for a valid year", async () => {
      const mockResult = { ticker: "aapl", year: "2023" };
      mockReq.params = { ticker: "AAPL" };
      mockReq.query = { year: "2023" };
      (CashFlowService.getCashFlowByTickerYear as jest.Mock).mockResolvedValue(
        mockResult
      );

      await CashFlowController.getCashFlow(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return all results for a ticker if no year", async () => {
      const mockResults = [{ year: "2023" }, { year: "2022" }];
      mockReq.params = { ticker: "AAPL" };
      mockReq.query = {};
      (CashFlowService.getCashFlowsByTicker as jest.Mock).mockResolvedValue(
        mockResults
      );

      await CashFlowController.getCashFlow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResults);
    });
  });

  describe("updateCashFlow", () => {
    it("should update and return updated result", async () => {
      const mockUpdated = { ticker: "aapl", year: "2024", cash: 9999 };
      mockReq.params = { ticker: "AAPL", fiscalYear: "2024" };
      mockReq.body = { _id: "123", cash: 9999 };
      (CashFlowService.updateCashFlow as jest.Mock).mockResolvedValue(
        mockUpdated
      );

      await CashFlowController.updateCashFlow(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockUpdated);
    });

    it("should return 404 if nothing is updated", async () => {
      mockReq.params = { ticker: "AAPL", fiscalYear: "2024" };
      mockReq.body = { _id: "123", cash: 9999 };
      (CashFlowService.updateCashFlow as jest.Mock).mockResolvedValue(null);

      await CashFlowController.updateCashFlow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "CashFlow not found",
      });
    });
  });

  describe("deleteCashFlow", () => {
    it("should delete and return 204", async () => {
      mockReq.params = { ticker: "AAPL", fiscalYear: "2023" };
      (CashFlowService.deleteCashFlow as jest.Mock).mockResolvedValue({});

      await CashFlowController.deleteCashFlow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("should return 404 if nothing deleted", async () => {
      mockReq.params = { ticker: "AAPL", fiscalYear: "2023" };
      (CashFlowService.deleteCashFlow as jest.Mock).mockResolvedValue(null);

      await CashFlowController.deleteCashFlow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "CashFlow not found",
      });
    });
  });
});
