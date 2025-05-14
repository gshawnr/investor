import { Request, Response, NextFunction } from "express";
import ExchangeRateController from "../../../controllers/exchangeRateController";
import ExchangeRateService from "../../../services/ExchangeRateService";

jest.mock("../../../services/ExchangeRateService");

describe("ExchangeRateController", () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createExchangeRate", () => {
    it("should return 201 and created exchange rate", async () => {
      const body = { currency: "USD", year: "2024", rate: 1.25 };
      const result = { id: "1", ...body };
      (ExchangeRateService.createExchangeRate as jest.Mock).mockResolvedValue(
        result
      );

      const req = { body } as Request;
      await ExchangeRateController.createExchangeRate(req, mockRes, mockNext);

      expect(ExchangeRateService.createExchangeRate).toHaveBeenCalledWith(body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(result);
    });

    it("should call next on error", async () => {
      const error = new Error("Error");
      (ExchangeRateService.createExchangeRate as jest.Mock).mockRejectedValue(
        error
      );

      const req = { body: {} } as Request;
      await ExchangeRateController.createExchangeRate(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getExchangeRates", () => {
    it("should return 400 for invalid currency", async () => {
      const req = {
        query: { currency: "usd1", year: "2024" },
      } as unknown as Request;
      await ExchangeRateController.getExchangeRates(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid currency format",
      });
    });

    it("should return 404 if not found", async () => {
      const req = {
        query: { currency: "USD", year: "2024" },
      } as unknown as Request;
      (ExchangeRateService.getExchangeRates as jest.Mock).mockResolvedValue(
        null
      );

      await ExchangeRateController.getExchangeRates(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "exchanges rate not found",
      });
    });

    it("should return exchange rates by currency and year", async () => {
      const req = {
        query: { currency: "USD", year: "2024" },
      } as unknown as Request;
      const results = [{ currency: "USD", year: "2024", rate: 1.25 }];

      (ExchangeRateService.getExchangeRates as jest.Mock).mockResolvedValue(
        results
      );

      await ExchangeRateController.getExchangeRates(req, mockRes, mockNext);

      expect(ExchangeRateService.getExchangeRates).toHaveBeenCalledWith({
        currency: "USD",
        year: "2024",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(results);
    });

    it("should return all exchange rates if no filters", async () => {
      const req = { query: {} } as unknown as Request;
      const results = [{ currency: "USD", year: "2023", rate: 1.2 }];
      (ExchangeRateService.getExchangeRates as jest.Mock).mockResolvedValue(
        results
      );

      await ExchangeRateController.getExchangeRates(req, mockRes, mockNext);

      expect(ExchangeRateService.getExchangeRates).toHaveBeenCalledWith({});
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(results);
    });

    it("should call next on error", async () => {
      const error = new Error("Failed");
      (ExchangeRateService.getExchangeRates as jest.Mock).mockRejectedValue(
        error
      );

      const req = { query: { currency: "USD" } } as unknown as Request;
      await ExchangeRateController.getExchangeRates(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("updateExchangeRate", () => {
    it("should return 400 for invalid currency", async () => {
      const req = {
        params: { currency: "us$", year: "2023" },
        body: {},
      } as unknown as Request;

      await ExchangeRateController.updateExchangeRate(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid currency format",
      });
    });

    it("should return 404 if not found", async () => {
      const req = {
        params: { currency: "USD", year: "2023" },
        body: { rate: 1.3 },
      } as unknown as Request;

      (ExchangeRateService.updateExchangeRate as jest.Mock).mockResolvedValue(
        null
      );

      await ExchangeRateController.updateExchangeRate(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "exchange rate not found",
      });
    });

    it("should update and return updated exchange rate", async () => {
      const req = {
        params: { currency: "USD", year: "2023" },
        body: { rate: 1.3, _id: "shouldBeRemoved" },
      } as unknown as Request;

      const result = { currency: "USD", year: "2023", rate: 1.3 };
      (ExchangeRateService.updateExchangeRate as jest.Mock).mockResolvedValue(
        result
      );

      await ExchangeRateController.updateExchangeRate(req, mockRes, mockNext);

      expect(ExchangeRateService.updateExchangeRate).toHaveBeenCalledWith(
        "USD",
        "2023",
        { rate: 1.3 }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(result);
    });

    it("should call next on error", async () => {
      const error = new Error("Failed");
      (ExchangeRateService.updateExchangeRate as jest.Mock).mockRejectedValue(
        error
      );

      const req = {
        params: { currency: "USD", year: "2023" },
        body: { rate: 1.2 },
      } as unknown as Request;

      await ExchangeRateController.updateExchangeRate(req, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteExchangeRate", () => {
    it("should return 400 for invalid currency", async () => {
      const req = {
        params: { currency: "usd$", year: "2023" },
      } as unknown as Request;

      await ExchangeRateController.deleteExchangeRate(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid currency format",
      });
    });

    it("should return 404 if not found", async () => {
      const req = {
        params: { currency: "USD", year: "2023" },
      } as unknown as Request;

      (ExchangeRateService.deleteExchangeRate as jest.Mock).mockResolvedValue(
        null
      );

      await ExchangeRateController.deleteExchangeRate(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "exchange rate not found",
      });
    });

    it("should return 204 when deleted", async () => {
      const req = {
        params: { currency: "USD", year: "2023" },
      } as unknown as Request;
      const result = { id: "1" };
      (ExchangeRateService.deleteExchangeRate as jest.Mock).mockResolvedValue(
        result
      );

      await ExchangeRateController.deleteExchangeRate(req, mockRes, mockNext);

      expect(ExchangeRateService.deleteExchangeRate).toHaveBeenCalledWith(
        "USD",
        "2023"
      );
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("should call next on error", async () => {
      const error = new Error("Failed");
      (ExchangeRateService.deleteExchangeRate as jest.Mock).mockRejectedValue(
        error
      );

      const req = {
        params: { currency: "USD", year: "2023" },
      } as unknown as Request;
      await ExchangeRateController.deleteExchangeRate(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
