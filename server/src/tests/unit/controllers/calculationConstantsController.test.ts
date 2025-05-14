import { Request, Response, NextFunction } from "express";
import CalculationConstantsController from "../../../controllers/calculationConstantsController";
import CalculationConstantsService from "../../../services/CalculationConstantsService";

jest.mock("../../../services/CalculationConstantsService");

describe("CalculationConstantsController", () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCalculationConstants", () => {
    it("should return 201 and created constants", async () => {
      const body = { year: "2024", taxRate: 0.3 };
      const result = { id: "abc", ...body };

      (
        CalculationConstantsService.createCalculationConstants as jest.Mock
      ).mockResolvedValue(result);

      const req = { body } as Request;
      await CalculationConstantsController.createCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(
        CalculationConstantsService.createCalculationConstants
      ).toHaveBeenCalledWith(body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(result);
    });

    it("should call next on error", async () => {
      const error = new Error("Failed");
      (
        CalculationConstantsService.createCalculationConstants as jest.Mock
      ).mockRejectedValue(error);

      const req = { body: {} } as Request;
      await CalculationConstantsController.createCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getCalculationConstants", () => {
    it("should return constants for a given year", async () => {
      const req = { query: { year: "2024" } } as unknown as Request;
      const result = { year: "2024", taxRate: 0.3 };

      (
        CalculationConstantsService.getCalculationConstants as jest.Mock
      ).mockResolvedValue(result);

      await CalculationConstantsController.getCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(
        CalculationConstantsService.getCalculationConstants
      ).toHaveBeenCalledWith("2024");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(result);
    });

    it("should return 400 for invalid year", async () => {
      const req = { query: { year: "20xx" } } as unknown as Request;

      await CalculationConstantsController.getCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid year format",
      });
    });

    it("should return 404 if constants not found", async () => {
      const req = { query: { year: "2024" } } as unknown as Request;

      (
        CalculationConstantsService.getCalculationConstants as jest.Mock
      ).mockResolvedValue(null);

      await CalculationConstantsController.getCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "calculation constants not found",
      });
    });

    it("should return all constants if year is not provided", async () => {
      const req = { query: {} } as unknown as Request;
      const results = [{ year: "2023" }, { year: "2024" }];

      (
        CalculationConstantsService.getAllCalculationConstants as jest.Mock
      ).mockResolvedValue(results);

      await CalculationConstantsController.getCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(
        CalculationConstantsService.getAllCalculationConstants
      ).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(results);
    });
  });

  describe("updateCalculationConstants", () => {
    it("should update and return the constants", async () => {
      const req = {
        params: { year: "2024" },
        body: { _id: "removeThis", taxRate: 0.4 },
      } as unknown as Request;

      const result = { year: "2024", taxRate: 0.4 };

      (
        CalculationConstantsService.updateCalculationConstants as jest.Mock
      ).mockResolvedValue(result);

      await CalculationConstantsController.updateCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(
        CalculationConstantsService.updateCalculationConstants
      ).toHaveBeenCalledWith("2024", { taxRate: 0.4 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(result);
    });

    it("should return 404 if constants not found", async () => {
      const req = {
        params: { year: "2024" },
        body: { taxRate: 0.4 },
      } as unknown as Request;

      (
        CalculationConstantsService.updateCalculationConstants as jest.Mock
      ).mockResolvedValue(null);

      await CalculationConstantsController.updateCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "calculation constants not found",
      });
    });

    it("should return 400 for invalid year", async () => {
      const req = {
        params: { year: "20xx" },
        body: { taxRate: 0.4 },
      } as unknown as Request;

      await CalculationConstantsController.updateCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid year format",
      });
    });
  });

  describe("deleteCalculationConstants", () => {
    it("should delete and return 204", async () => {
      const req = { params: { year: "2023" } } as unknown as Request;

      (
        CalculationConstantsService.deleteCalculationConstants as jest.Mock
      ).mockResolvedValue({ id: "abc" });

      await CalculationConstantsController.deleteCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(
        CalculationConstantsService.deleteCalculationConstants
      ).toHaveBeenCalledWith("2023");
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("should return 404 if not found", async () => {
      const req = { params: { year: "2023" } } as unknown as Request;

      (
        CalculationConstantsService.deleteCalculationConstants as jest.Mock
      ).mockResolvedValue(null);

      await CalculationConstantsController.deleteCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "calculation constant not found",
      });
    });

    it("should return 400 for invalid year", async () => {
      const req = { params: { year: "20xy" } } as unknown as Request;

      await CalculationConstantsController.deleteCalculationConstants(
        req,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid year format",
      });
    });
  });
});
