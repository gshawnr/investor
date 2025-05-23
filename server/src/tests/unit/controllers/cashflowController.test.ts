import cashflowController from "../../../controllers/cashflowController";
import CashflowService from "../../../services/CashflowService";
import { Request, Response, NextFunction } from "express";

jest.mock("../../../services/CashflowService");

describe("cashflowController", () => {
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

  describe("createCashflow", () => {
    it("should create a cash flow and return 201", async () => {
      const mockData = { ticker: "aapl", year: "2024", cash: 5000 };
      (CashflowService.createCashflow as jest.Mock).mockResolvedValue(mockData);

      mockReq.body = mockData;

      await cashflowController.createCashflow(mockReq, mockRes, mockNext);

      expect(CashflowService.createCashflow).toHaveBeenCalledWith(mockData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });

    it("should call next on error", async () => {
      const error = new Error("Test error");
      (CashflowService.createCashflow as jest.Mock).mockRejectedValue(error);

      await cashflowController.createCashflow(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getCashflow", () => {
    it("should return 400 if year is invalid", async () => {
      mockReq.params = { ticker: "AAPL" };
      mockReq.query = { year: "20xx" };

      await cashflowController.getCashflow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid year format",
      });
    });

    it("should return 404 if no result found for year", async () => {
      mockReq.params = { ticker: "AAPL" };
      mockReq.query = { year: "2023" };
      (CashflowService.getCashflowByTickerYear as jest.Mock).mockResolvedValue(
        null
      );

      await cashflowController.getCashflow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Cashflow not found",
      });
    });

    it("should return result for a valid year", async () => {
      const mockResult = { ticker: "aapl", year: "2023" };
      mockReq.params = { ticker: "AAPL" };
      mockReq.query = { year: "2023" };
      (CashflowService.getCashflowByTickerYear as jest.Mock).mockResolvedValue(
        mockResult
      );

      await cashflowController.getCashflow(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return all results for a ticker if no year", async () => {
      const mockResults = [{ year: "2023" }, { year: "2022" }];
      mockReq.params = { ticker: "AAPL" };
      mockReq.query = {};
      (CashflowService.getCashflowsByTicker as jest.Mock).mockResolvedValue(
        mockResults
      );

      await cashflowController.getCashflow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResults);
    });
  });

  describe("updateCashflow", () => {
    it("should update and return updated result", async () => {
      const mockUpdated = { ticker: "aapl", year: "2024", cash: 9999 };
      mockReq.params = { ticker: "AAPL", year: "2024" };
      mockReq.body = { _id: "123", cash: 9999 };
      (CashflowService.updateCashflow as jest.Mock).mockResolvedValue(
        mockUpdated
      );

      await cashflowController.updateCashflow(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockUpdated);
    });

    it("should return 404 if nothing is updated", async () => {
      mockReq.params = { ticker: "AAPL", year: "2024" };
      mockReq.body = { _id: "123", cash: 9999 };
      (CashflowService.updateCashflow as jest.Mock).mockResolvedValue(null);

      await cashflowController.updateCashflow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Cashflow not found",
      });
    });
  });

  describe("deleteCashflow", () => {
    it("should delete and return 204", async () => {
      mockReq.params = { ticker: "AAPL", year: "2023" };
      (CashflowService.deleteCashflow as jest.Mock).mockResolvedValue({});

      await cashflowController.deleteCashflow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("should return 404 if nothing deleted", async () => {
      mockReq.params = { ticker: "AAPL", year: "2023" };
      (CashflowService.deleteCashflow as jest.Mock).mockResolvedValue(null);

      await cashflowController.deleteCashflow(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Cashflow not found",
      });
    });
  });
});
