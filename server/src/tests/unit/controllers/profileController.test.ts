import ProfileController from "../../../controllers/profileController";
import ProfileService from "../../../services/ProfileService";
import { Request, Response, NextFunction } from "express";

jest.mock("../../../services/ProfileService");

describe("ProfileController", () => {
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

  describe("createProfile", () => {
    it("should create a profile and return 201", async () => {
      const mockData = { ticker: "AAPL", name: "Apple Inc." };
      mockReq.body = mockData;
      (ProfileService.createProfile as jest.Mock).mockResolvedValue(mockData);

      await ProfileController.createProfile(mockReq, mockRes, mockNext);

      expect(ProfileService.createProfile).toHaveBeenCalledWith(mockData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });

    it("should call next on error", async () => {
      const error = new Error("create error");
      (ProfileService.createProfile as jest.Mock).mockRejectedValue(error);

      await ProfileController.createProfile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getProfile", () => {
    it("should return profile if found", async () => {
      const mockProfile = { ticker: "AAPL", name: "Apple Inc." };
      mockReq.params = { ticker: "AAPL" };
      (ProfileService.getProfileByTicker as jest.Mock).mockResolvedValue(
        mockProfile
      );

      await ProfileController.getProfile(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockProfile);
    });

    it("should return 404 if profile not found", async () => {
      mockReq.params = { ticker: "AAPL" };
      (ProfileService.getProfileByTicker as jest.Mock).mockResolvedValue(null);

      await ProfileController.getProfile(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Profile not found",
      });
    });

    it("should call next on error", async () => {
      const error = new Error("get error");
      mockReq.params = { ticker: "AAPL" };
      (ProfileService.getProfileByTicker as jest.Mock).mockRejectedValue(error);

      await ProfileController.getProfile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllProfiles", () => {
    it("should return all profiles", async () => {
      const mockProfiles = [{ ticker: "AAPL" }, { ticker: "MSFT" }];
      (ProfileService.getProfiles as jest.Mock).mockResolvedValue(mockProfiles);

      await ProfileController.getAllProfiles(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProfiles);
    });

    it("should call next on error", async () => {
      const error = new Error("get all error");
      (ProfileService.getProfiles as jest.Mock).mockRejectedValue(error);

      await ProfileController.getAllProfiles(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("updateProfile", () => {
    it("should update and return profile", async () => {
      const updates = { name: "Updated Name" };
      const mockUpdated = { ticker: "AAPL", name: "Updated Name" };
      mockReq.params = { ticker: "AAPL" };
      mockReq.body = { ...updates, _id: "abc123" };
      (ProfileService.updateProfile as jest.Mock).mockResolvedValue(
        mockUpdated
      );

      await ProfileController.updateProfile(mockReq, mockRes, mockNext);

      expect(ProfileService.updateProfile).toHaveBeenCalledWith(
        "AAPL",
        updates
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdated);
    });

    it("should return 404 if profile not found", async () => {
      mockReq.params = { ticker: "AAPL" };
      mockReq.body = { name: "New Name" };
      (ProfileService.updateProfile as jest.Mock).mockResolvedValue(null);

      await ProfileController.updateProfile(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Profile not found",
      });
    });

    it("should call next on error", async () => {
      const error = new Error("update error");
      mockReq.params = { ticker: "AAPL" };
      mockReq.body = { name: "Error Case" };
      (ProfileService.updateProfile as jest.Mock).mockRejectedValue(error);

      await ProfileController.updateProfile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteProfile", () => {
    it("should delete and return 204", async () => {
      mockReq.params = { ticker: "AAPL" };
      (ProfileService.deleteProfile as jest.Mock).mockResolvedValue({});

      await ProfileController.deleteProfile(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("should return 404 if profile not found", async () => {
      mockReq.params = { ticker: "AAPL" };
      (ProfileService.deleteProfile as jest.Mock).mockResolvedValue(null);

      await ProfileController.deleteProfile(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Profile not found",
      });
    });

    it("should call next on error", async () => {
      const error = new Error("delete error");
      mockReq.params = { ticker: "AAPL" };
      (ProfileService.deleteProfile as jest.Mock).mockRejectedValue(error);

      await ProfileController.deleteProfile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
