// tests/controllers/CalculationConstantsController.test.ts

import { Request, Response, NextFunction } from "express";
import CalculationConstantsController from "../../../controllers/calculationConstantsController";
import CalculationConstantsService from "../../../services/CalculationConstantsService";

// Mock the service layer
jest.mock("../../../services/CalculationConstantsService");

const mockReq = {} as Request;
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
} as unknown as Response;

const mockNext = jest.fn() as NextFunction;

describe("CalculationConstantsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCalculationConstants", () => {
    it("should create constants and return 201", async () => {
      const mockData = { year: "2025", values: { x: 1 } };
      mockReq.body = mockData;
      (
        CalculationConstantsService.createCalculationConstants as jest.Mock
      ).mockResolvedValue(mockData);

      await CalculationConstantsController.createCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(
        CalculationConstantsService.createCalculationConstants
      ).toHaveBeenCalledWith(mockData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });

    it("should call next with error if service throws", async () => {
      const error = new Error("create error");
      (
        CalculationConstantsService.createCalculationConstants as jest.Mock
      ).mockRejectedValue(error);

      await CalculationConstantsController.createCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getCalculationConstants", () => {
    it("should return one constant by year", async () => {
      const year = "2024";
      const mockResult = { year, values: { y: 2 } };
      mockReq.query = { year };
      (
        CalculationConstantsService.getCalculationConstants as jest.Mock
      ).mockResolvedValue(mockResult);

      await CalculationConstantsController.getCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 400 for invalid year", async () => {
      mockReq.query = { year: "20ab" };

      await CalculationConstantsController.getCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid year format",
      });
    });

    it("should return 404 if constants not found", async () => {
      mockReq.query = { year: "2023" };
      (
        CalculationConstantsService.getCalculationConstants as jest.Mock
      ).mockResolvedValue(null);

      await CalculationConstantsController.getCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "calculation constants not found",
      });
    });

    it("should return all constants if no year is provided", async () => {
      const allResults = [{ year: "2022" }, { year: "2023" }];
      mockReq.query = {};
      (
        CalculationConstantsService.getAllCalculationConstants as jest.Mock
      ).mockResolvedValue(allResults);

      await CalculationConstantsController.getCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(allResults);
    });
  });

  describe("updateCalculationConstants", () => {
    it("should update constants and return 200", async () => {
      const year = "2023";
      const updated = { year, values: { updated: true } };
      mockReq.params = { year };
      mockReq.body = { _id: "someid", values: { updated: true } };

      (
        CalculationConstantsService.updateCalculationConstants as jest.Mock
      ).mockResolvedValue(updated);

      await CalculationConstantsController.updateCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updated);
    });

    it("should return 400 for invalid year", async () => {
      mockReq.params = { year: "20a1" };
      mockReq.body = {};

      await CalculationConstantsController.updateCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid year format",
      });
    });

    it("should return 404 if update fails", async () => {
      mockReq.params = { year: "2023" };
      mockReq.body = {};
      (
        CalculationConstantsService.updateCalculationConstants as jest.Mock
      ).mockResolvedValue(null);

      await CalculationConstantsController.updateCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "calculation constants not found",
      });
    });
  });

  describe("deleteCalculationConstants", () => {
    it("should delete constants and return 204", async () => {
      mockReq.params = { year: "2022" };
      (
        CalculationConstantsService.deleteCalculationConstants as jest.Mock
      ).mockResolvedValue(true);

      await CalculationConstantsController.deleteCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("should return 400 for invalid year", async () => {
      mockReq.params = { year: "20ab" };

      await CalculationConstantsController.deleteCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid year format",
      });
    });

    it("should return 404 if deletion fails", async () => {
      mockReq.params = { year: "2020" };
      (
        CalculationConstantsService.deleteCalculationConstants as jest.Mock
      ).mockResolvedValue(null);

      await CalculationConstantsController.deleteCalculationConstants(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "calculation constant not found",
      });
    });
  });
});
