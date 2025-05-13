import { Request, Response, NextFunction } from "express";
import BalanceSheetController from "../../../controllers/balanceSheetController";
import BalanceSheetService from "../../../services/BalanceSheetService";

jest.mock("../../../services/BalanceSheetService");

describe("BalanceSheetController", () => {
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

  describe("createBalanceSheet", () => {
    it("should return 201 and the created balance sheet", async () => {
      const body = { ticker: "AAPL", fiscalYear: "2024-12-31", assets: 1000 };
      const result = { id: "123", ...body };

      (BalanceSheetService.createBalanceSheet as jest.Mock).mockResolvedValue(
        result
      );
      const req = { body } as Request;

      await BalanceSheetController.createBalanceSheet(req, mockRes, mockNext);

      expect(BalanceSheetService.createBalanceSheet).toHaveBeenCalledWith(body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(result);
    });

    it("should call next on error", async () => {
      const error = new Error("Failed");
      (BalanceSheetService.createBalanceSheet as jest.Mock).mockRejectedValue(
        error
      );

      const req = { body: {} } as Request;
      await BalanceSheetController.createBalanceSheet(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getBalanceSheet", () => {
    it("should return balance sheet by ticker and year", async () => {
      const req = {
        params: { ticker: "AAPL" },
        query: { year: "2024" },
      } as unknown as Request;

      const mockResult = { ticker: "aapl", fiscalYear: "2024-12-31" };

      (
        BalanceSheetService.getBalanceSheetByTickerYear as jest.Mock
      ).mockResolvedValue(mockResult);

      await BalanceSheetController.getBalanceSheet(req, mockRes, mockNext);

      expect(
        BalanceSheetService.getBalanceSheetByTickerYear
      ).toHaveBeenCalledWith("AAPL", "2024");
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 400 for invalid year", async () => {
      const req = {
        params: { ticker: "AAPL" },
        query: { year: "20ab" },
      } as unknown as Request;

      await BalanceSheetController.getBalanceSheet(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid year format",
      });
    });

    it("should return 404 if balance sheet not found", async () => {
      const req = {
        params: { ticker: "AAPL" },
        query: { year: "2024" },
      } as unknown as Request;

      (
        BalanceSheetService.getBalanceSheetByTickerYear as jest.Mock
      ).mockResolvedValue(null);

      await BalanceSheetController.getBalanceSheet(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "balance sheet not found",
      });
    });

    it("should return multiple balance sheets if year not provided", async () => {
      const req = {
        params: { ticker: "AAPL" },
        query: {},
      } as unknown as Request;

      const results = [{ ticker: "aapl", fiscalYear: "2023-12-31" }];
      (
        BalanceSheetService.getBalanceSheetsByTicker as jest.Mock
      ).mockResolvedValue(results);

      await BalanceSheetController.getBalanceSheet(req, mockRes, mockNext);

      expect(BalanceSheetService.getBalanceSheetsByTicker).toHaveBeenCalledWith(
        "AAPL"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(results);
    });
  });

  describe("updateBalanceSheet", () => {
    it("should update and return the updated sheet", async () => {
      const req = {
        params: { ticker: "AAPL", year: "2024" },
        body: { assets: 2000, _id: "shouldBeRemoved" },
      } as unknown as Request;

      const result = {
        ticker: "aapl",
        fiscalYear: "2024",
        raw: { assets: 2000 },
      };
      (BalanceSheetService.updateBalanceSheet as jest.Mock).mockResolvedValue(
        result
      );

      await BalanceSheetController.updateBalanceSheet(req, mockRes, mockNext);

      expect(BalanceSheetService.updateBalanceSheet).toHaveBeenCalledWith(
        "AAPL",
        "2024",
        { assets: 2000 }
      );
      expect(mockRes.json).toHaveBeenCalledWith(result);
    });

    it("should return 404 if not found", async () => {
      const req = {
        params: { ticker: "AAPL", year: "2024" },
        body: { assets: 2000 },
      } as unknown as Request;

      (BalanceSheetService.updateBalanceSheet as jest.Mock).mockResolvedValue(
        null
      );

      await BalanceSheetController.updateBalanceSheet(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "BalanceSheet not found",
      });
    });
  });

  describe("deleteBalanceSheet", () => {
    it("should delete and return 204", async () => {
      const req = {
        params: { ticker: "AAPL", year: "2023" },
      } as unknown as Request;

      const deletedResult = { id: "1" };
      (BalanceSheetService.deleteBalanceSheet as jest.Mock).mockResolvedValue(
        deletedResult
      );

      await BalanceSheetController.deleteBalanceSheet(req, mockRes, mockNext);

      expect(BalanceSheetService.deleteBalanceSheet).toHaveBeenCalledWith(
        "AAPL",
        "2023"
      );
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("should return 404 if not found", async () => {
      const req = {
        params: { ticker: "AAPL", year: "2023" },
      } as unknown as Request;

      (BalanceSheetService.deleteBalanceSheet as jest.Mock).mockResolvedValue(
        null
      );

      await BalanceSheetController.deleteBalanceSheet(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "BalanceSheet not found",
      });
    });
  });
});
