import { Request, Response, NextFunction } from "express";
import IncomeController from "../../../controllers/incomeController";
import IncomeService from "../../../services/IncomeService";

jest.mock("../../../services/IncomeService");

describe("IncomeController", () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createIncome", () => {
    it("should return 201 and the created income", async () => {
      const body = { ticker: "AAPL", fiscalYear: "2024-10-23", revenue: 1000 };
      const result = { id: "1", ...body };
      (IncomeService.createIncome as jest.Mock).mockResolvedValue(result);

      const req = { body } as Request;

      await IncomeController.createIncome(req, mockRes, mockNext);

      expect(IncomeService.createIncome).toHaveBeenCalledWith(body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(result);
    });

    it("should call next on error", async () => {
      const error = new Error("Create error");
      (IncomeService.createIncome as jest.Mock).mockRejectedValue(error);

      const req = { body: {} } as Request;
      await IncomeController.createIncome(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getIncome", () => {
    it("should return income by ticker and year", async () => {
      const req = {
        params: { ticker: "AAPL" },
        query: { year: "2024" },
      } as unknown as Request;

      const mockResult = {
        ticker: "AAPL",
        fiscalYear: "2024-10-23",
        revenue: 1000,
      };
      (IncomeService.getIncomeByTickerYear as jest.Mock).mockResolvedValue(
        mockResult
      );

      await IncomeController.getIncome(req, mockRes, mockNext);

      expect(IncomeService.getIncomeByTickerYear).toHaveBeenCalledWith(
        "AAPL",
        "2024"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 400 for invalid year format", async () => {
      const req = {
        params: { ticker: "AAPL" },
        query: { year: "20x4" },
      } as unknown as Request;

      await IncomeController.getIncome(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid year format",
      });
    });

    it("should return 404 if income not found", async () => {
      const req = {
        params: { ticker: "AAPL" },
        query: { year: "2024" },
      } as unknown as Request;

      (IncomeService.getIncomeByTickerYear as jest.Mock).mockResolvedValue(
        null
      );

      await IncomeController.getIncome(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "income not found",
      });
    });

    it("should return all incomes if year not provided", async () => {
      const req = {
        params: { ticker: "AAPL" },
        query: {},
      } as unknown as Request;

      const mockResults = [{ fiscalYear: "2023-10-23", revenue: 900 }];
      (IncomeService.getIncomeByTicker as jest.Mock).mockResolvedValue(
        mockResults
      );

      await IncomeController.getIncome(req, mockRes, mockNext);

      expect(IncomeService.getIncomeByTicker).toHaveBeenCalledWith("AAPL");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResults);
    });
  });

  describe("updateIncome", () => {
    it("should update and return income", async () => {
      const req = {
        params: { ticker: "AAPL", year: "2024" },
        body: { revenue: 2000, _id: "removeMe" },
      } as unknown as Request;

      const mockResult = {
        ticker: "AAPL",
        fiscalYear: "2024-10-23",
        revenue: 2000,
      };

      (IncomeService.updateIncome as jest.Mock).mockResolvedValue(mockResult);

      await IncomeController.updateIncome(req, mockRes, mockNext);

      expect(IncomeService.updateIncome).toHaveBeenCalledWith("AAPL", "2024", {
        revenue: 2000,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 404 if income not found", async () => {
      const req = {
        params: { ticker: "AAPL", year: "2024" },
        body: { revenue: 2000 },
      } as unknown as Request;

      (IncomeService.updateIncome as jest.Mock).mockResolvedValue(null);

      await IncomeController.updateIncome(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "income not found",
      });
    });
  });

  describe("deleteIncome", () => {
    it("should delete and return 204", async () => {
      const req = {
        params: { ticker: "AAPL", year: "2023" },
      } as unknown as Request;

      (IncomeService.deleteIncome as jest.Mock).mockResolvedValue({ id: "1" });

      await IncomeController.deleteIncome(req, mockRes, mockNext);

      expect(IncomeService.deleteIncome).toHaveBeenCalledWith("AAPL", "2023");
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("should return 400 for invalid year format", async () => {
      const req = {
        params: { ticker: "AAPL", year: "20ab" },
      } as unknown as Request;

      await IncomeController.deleteIncome(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid year format",
      });
    });

    it("should return 404 if income not found", async () => {
      const req = {
        params: { ticker: "AAPL", year: "2023" },
      } as unknown as Request;

      (IncomeService.deleteIncome as jest.Mock).mockResolvedValue(null);

      await IncomeController.deleteIncome(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "income not found",
      });
    });
  });
});
