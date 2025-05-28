import IncomeService from "../../../services/IncomeService";
import Income from "../../../models/Income";
import { IIncome } from "../../../types/IIncome";

// Mock the entire Income Mongoose model
jest.mock("../../../models/Income");

describe("IncomeService", () => {
  let mockIncome: jest.Mocked<typeof Income>;

  beforeEach(() => {
    mockIncome = Income as jest.Mocked<typeof Income>;
    jest.clearAllMocks();
  });

  describe("createIncome", () => {
    it("should create an income record successfully", async () => {
      const inputData: Partial<IIncome> = {
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
        raw: { revenue: 1000 },
      };

      // Mock findOne to return null (no existing record)
      mockIncome.findOne.mockResolvedValue(null);

      // Mock save on new Income instance
      const mockSave = jest.fn().mockResolvedValue({
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData.raw,
      });

      (mockIncome as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));

      const res = await IncomeService.createIncome(inputData);

      expect(mockIncome).toHaveBeenCalledWith({
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData.raw,
      });
      expect(mockSave).toHaveBeenCalled();
      expect(res).toEqual({
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData.raw,
      });
    });

    it("should throw an error if income already exists", async () => {
      const inputData: Partial<IIncome> = {
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
      };

      mockIncome.findOne.mockResolvedValue({});

      await expect(IncomeService.createIncome(inputData)).rejects.toThrow(
        "income for aapl_2024 alread exists"
      );

      expect(mockIncome).not.toHaveBeenCalledWith(expect.anything());
    });
  });

  describe("getIncome", () => {
    it("should return all income records", async () => {
      const mockResults = [
        { ticker: "aapl", fiscalYear: "2024-12-31" },
        { ticker: "aapl", fiscalYear: "2023-12-31" },
      ];
      mockIncome.find.mockResolvedValue(mockResults as any);

      const res = await IncomeService.getIncome();

      expect(mockIncome.find).toHaveBeenCalledWith({});
      expect(res).toEqual(mockResults);
    });
  });

  describe("getIncomeByTicker", () => {
    it("should return sorted income records by ticker", async () => {
      const ticker = "AAPL";
      const formattedTicker = "aapl";

      const mockResult = [
        { ticker: formattedTicker, fiscalYear: "2022-12-31" },
        { ticker: formattedTicker, fiscalYear: "2024-12-31" },
        { ticker: formattedTicker, fiscalYear: "2023-12-31" },
      ];

      const sortMock = { sort: jest.fn().mockResolvedValue(mockResult) };
      mockIncome.find.mockReturnValue(sortMock as any);

      const res = await IncomeService.getIncomeByTicker(ticker);

      expect(mockIncome.find).toHaveBeenCalledWith({ ticker: formattedTicker });
      expect(sortMock.sort).toHaveBeenCalledWith({ fiscalYear: -1 });
      expect(res).toEqual(mockResult);
    });
  });

  describe("getIncomeByTickerYear", () => {
    it("should return a specific income record", async () => {
      const ticker = "AAPL";
      const year = "2024";
      const ticker_year = "aapl_2024";
      const mockResult = { ticker: "aapl", ticker_year };

      mockIncome.findOne.mockResolvedValue(mockResult as any);

      const res = await IncomeService.getIncomeByTickerYear(ticker, year);

      expect(mockIncome.findOne).toHaveBeenCalledWith({ ticker_year });
      expect(res).toEqual(mockResult);
    });
  });

  describe("updateIncome", () => {
    it("should update and return the updated income", async () => {
      const ticker = "AAPL";
      const year = "2024";
      const updates = { raw: { revenue: 2000 } };
      const mockUpdated = { ticker: "aapl", year, raw: updates.raw };

      mockIncome.findOneAndUpdate.mockResolvedValue(mockUpdated as any);

      const res = await IncomeService.updateIncome(ticker, year, updates);

      expect(mockIncome.findOneAndUpdate).toHaveBeenCalledWith(
        { ticker_year: "aapl_2024" },
        { $set: updates },
        { new: true, runValidators: true }
      );
      expect(res).toEqual(mockUpdated);
    });
  });

  describe("deleteIncome", () => {
    it("should delete and return the result of the deletion", async () => {
      const ticker = "AAPL";
      const year = "2023";
      const mockDeleted = { deletedCount: 1 };

      mockIncome.deleteOne.mockResolvedValue(mockDeleted as any);

      const res = await IncomeService.deleteIncome(ticker, year);

      expect(mockIncome.deleteOne).toHaveBeenCalledWith({
        ticker_year: "aapl_2023",
      });
      expect(res).toEqual(mockDeleted);
    });
  });
});
