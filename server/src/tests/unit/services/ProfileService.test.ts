import ProfileService from "../../../services/ProfileService";
import Profile from "../../../models/Profile";

jest.mock("../../../models/Profile");

describe("ProfileService", () => {
  let mockProfile: jest.Mocked<typeof Profile>;

  beforeEach(() => {
    mockProfile = Profile as jest.Mocked<typeof Profile>;
    jest.clearAllMocks();
  });

  describe("createProfile", () => {
    it("should create a profile successfully", async () => {
      const input = {
        ticker: "AAPL",
        companyName: "Apple Inc.",
        exchange: "NASDAQ",
        beta: 1.2,
        industry: "Consumer Electronics",
        sector: "Technology",
        raw: { companyName: "Apple Inc.", ceo: "Tim Cook" },
      };

      mockProfile.findOne.mockResolvedValue(null);

      const mockSave = jest.fn().mockResolvedValue({
        ...input,
        ticker: "aapl",
        raw: input.raw,
      });

      (mockProfile as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));

      const res = await ProfileService.createProfile(input);

      expect(mockProfile.findOne).toHaveBeenCalledWith({ ticker: "aapl" });

      // Check constructor was called with the transformed data
      expect(mockProfile).toHaveBeenCalledWith({
        ...input,
        raw: { ...input.raw },
      });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should throw an error if profile already exists", async () => {
      const input = {
        ticker: "AAPL",
        companyName: "Apple Inc.",
        exchange: "NASDAQ",
        beta: 1.2,
        industry: "Consumer Electronics",
        sector: "Technology",
      };

      mockProfile.findOne.mockResolvedValue({});

      await expect(ProfileService.createProfile(input)).rejects.toThrow(
        `Profile for ticker "AAPL" already exists.`
      );
    });

    it("should throw an error if ticker is missing", async () => {
      await expect(ProfileService.createProfile({})).rejects.toThrow(
        "Ticker is required to create a profile."
      );
    });
  });

  describe("getProfiles", () => {
    it("should return all profiles", async () => {
      const mockResult = [{ ticker: "aapl" }];
      mockProfile.find.mockResolvedValue(mockResult);

      const res = await ProfileService.getProfiles();

      expect(mockProfile.find).toHaveBeenCalledWith({}, null, {});
      expect(res).toEqual(mockResult);
    });
  });

  describe("getProfileByTicker", () => {
    it("should return a single profile by ticker", async () => {
      const mockResult = { ticker: "aapl" };
      mockProfile.findOne.mockResolvedValue(mockResult);

      const res = await ProfileService.getProfileByTicker("AAPL");

      expect(mockProfile.findOne).toHaveBeenCalledWith({ ticker: "aapl" });
      expect(res).toEqual(mockResult);
    });
  });

  describe("updateProfile", () => {
    it("should update and return the updated profile", async () => {
      const updates = { beta: 1.5 };
      const mockUpdated = { ticker: "aapl", beta: 1.5 };

      mockProfile.findOneAndUpdate.mockResolvedValue(mockUpdated);

      const res = await ProfileService.updateProfile("AAPL", updates);

      expect(mockProfile.findOneAndUpdate).toHaveBeenCalledWith(
        { ticker: "aapl" },
        { $set: updates },
        { new: true, runValidators: true }
      );
      expect(res).toEqual(mockUpdated);
    });
  });

  describe("deleteProfile", () => {
    it("should delete and return the deleted profile", async () => {
      const mockDeleted = { ticker: "aapl" };

      mockProfile.findOneAndDelete.mockResolvedValue(mockDeleted);

      const res = await ProfileService.deleteProfile("AAPL");

      expect(mockProfile.findOneAndDelete).toHaveBeenCalledWith({
        ticker: "aapl",
      });
      expect(res).toEqual(mockDeleted);
    });
  });
});
