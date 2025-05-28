import ExchangeRateService from "../../../services/ExchangeRateService";
import ExchangeRate from "../../../models/ExchangeRate";
import { IExchangeRate } from "../../../types/IExchangeRate";

jest.mock("../../../models/ExchangeRate");

describe("ExchangeRateService", () => {
  let mockExchangeRate: jest.Mocked<typeof ExchangeRate>;

  beforeEach(() => {
    mockExchangeRate = ExchangeRate as jest.Mocked<typeof ExchangeRate>;
    jest.clearAllMocks();
  });

  describe("createExchangeRate", () => {
    it("should create a new exchange rate", async () => {
      const inputData: Partial<IExchangeRate> = {
        currency: "CAD",
        year: "2024",
        rateToUSD: 0.74,
      };

      mockExchangeRate.findOne.mockResolvedValue(null);

      const mockSave = jest.fn().mockResolvedValue({
        currency: "CAD",
        year: "2024",
        currency_year: "CAD_2024",
        rateToUSD: 0.74,
      });

      (mockExchangeRate as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await ExchangeRateService.createExchangeRate(inputData);

      expect(mockExchangeRate).toHaveBeenCalledWith({
        currency_year: "CAD_2024",
        currency: "CAD",
        year: "2024",
        rateToUSD: 0.74,
      });

      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual({
        currency: "CAD",
        year: "2024",
        currency_year: "CAD_2024",
        rateToUSD: 0.74,
      });
    });

    it("should throw if rateToUSD is not a valid number", async () => {
      const inputData: Partial<IExchangeRate> = {
        currency: "CAD",
        year: "2024",
        rateToUSD: "abc" as any,
      };

      await expect(
        ExchangeRateService.createExchangeRate(inputData)
      ).rejects.toThrow("rateToUSD must be a valid number or numeric string");
    });

    it("should throw if exchange rate already exists", async () => {
      const inputData: Partial<IExchangeRate> = {
        currency: "CAD",
        year: "2024",
        rateToUSD: 0.74,
      };

      mockExchangeRate.findOne.mockResolvedValue({});

      await expect(
        ExchangeRateService.createExchangeRate(inputData)
      ).rejects.toThrow("exchange rate for CAD_2024 already exists");
    });
  });

  describe("getExchangeRates", () => {
    it("should get exchange rates by currency", async () => {
      const input = { currency: "CAD" };
      const mockResult = [{ currency: "CAD", year: "2024", rateToUSD: 0.74 }];

      const sortMock = { sort: jest.fn().mockResolvedValue(mockResult) };
      mockExchangeRate.find.mockReturnValue(sortMock as any);

      const result = await ExchangeRateService.getExchangeRates(input);

      expect(mockExchangeRate.find).toHaveBeenCalledWith({ currency: "CAD" });
      expect(sortMock.sort).toHaveBeenCalledWith({ year: -1 });
      expect(result).toEqual(mockResult);
    });
  });

  describe("updateExchangeRate", () => {
    it("should update the exchange rate", async () => {
      const updates: Partial<IExchangeRate> = {
        rateToUSD: 0.75,
      };

      const expected = {
        currency: "CAD",
        year: "2024",
        rateToUSD: 0.75,
      };

      mockExchangeRate.findOneAndUpdate.mockResolvedValue(expected);

      const result = await ExchangeRateService.updateExchangeRate(
        "CAD",
        "2024",
        updates
      );

      expect(mockExchangeRate.findOneAndUpdate).toHaveBeenCalledWith(
        { currency: "CAD", year: "2024" },
        { $set: { rateToUSD: 0.75 } },
        { new: true, runValidators: true }
      );

      expect(result).toEqual(expected);
    });

    it("should throw if updated rate is invalid", async () => {
      const updates = { rateToUSD: "invalid" as any };

      await expect(
        ExchangeRateService.updateExchangeRate("CAD", "2024", updates)
      ).rejects.toThrow("rateToUSD must be a valid number or numeric string");
    });
  });

  describe("deleteExchangeRate", () => {
    it("should delete an exchange rate", async () => {
      const mockDeleted = {
        currency: "CAD",
        year: "2023",
        rateToUSD: 0.77,
      };

      mockExchangeRate.findOneAndDelete.mockResolvedValue(mockDeleted);

      const result = await ExchangeRateService.deleteExchangeRate(
        "CAD",
        "2023"
      );

      expect(mockExchangeRate.findOneAndDelete).toHaveBeenCalledWith({
        currency: "CAD",
        year: "2023",
      });
      expect(result).toEqual(mockDeleted);
    });
  });
});
