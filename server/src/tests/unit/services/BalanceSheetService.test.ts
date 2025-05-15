import BalanceSheetService from "../../../services/BalanceSheetService";
import BalanceSheet from "../../../models/BalanceSheet";
import { IBalanceSheet } from "../../../types/IBalanceSheet";
import { raw } from "express";

// Mock the entire BalanceSheet Mongoose model
jest.mock("../../../models/BalanceSheet");

describe("BalanceSheetService", () => {
  let mockBalanceSheet: jest.Mocked<typeof BalanceSheet>;

  beforeEach(() => {
    mockBalanceSheet = BalanceSheet as jest.Mocked<typeof BalanceSheet>;
    jest.clearAllMocks();
  });

  describe("createBalanceSheet", () => {
    it("should create a balance sheet successfully", async () => {
      const inputData = {
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
        assets: 1000,
        raw: { symbol: "AAPL", date: "2024-12-31", assets: 1000 },
      };

      // Mock findOne to return null (no existing record)
      mockBalanceSheet.findOne.mockResolvedValue(null);

      // Mock the save function on the instance
      const mockSave = jest.fn().mockResolvedValue({
        ticker: "aapl",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData.raw,
      });

      // Mock the constructor so `new BalanceSheet()` returns an object with a `save` method
      (mockBalanceSheet as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));

      // Run the service method
      const res = await BalanceSheetService.createBalanceSheet(inputData);

      // Check constructor was called with the transformed data
      expect(mockBalanceSheet).toHaveBeenCalledWith({
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData.raw,
      });

      // Check save was called
      expect(mockSave).toHaveBeenCalled();

      // Check the response from save
      expect(res).toEqual({
        ticker: "aapl",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData.raw,
      });
    });

    it("should throw an error if balance sheet already exists", async () => {
      const inputData: Partial<IBalanceSheet> = {
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
      };

      // Mock findOne to return an existing record
      mockBalanceSheet.findOne.mockResolvedValue({});

      await expect(
        BalanceSheetService.createBalanceSheet(inputData)
      ).rejects.toThrow("BalanceSheet for aapl_2024 already exists.");

      // Ensure constructor was not called (because it should short-circuit)
      expect(mockBalanceSheet).not.toHaveBeenCalled();
    });
  });

  describe("Read Operations", () => {
    let mockBalanceSheet: jest.Mocked<typeof BalanceSheet>;

    beforeEach(() => {
      mockBalanceSheet = BalanceSheet as jest.Mocked<typeof BalanceSheet>;
      jest.clearAllMocks();
    });

    describe("getBalanceSheets", () => {
      it("should return one balance sheet", async () => {
        const mockResult = { ticker: "aapl", fiscalYear: "2024-12-31" };
        mockBalanceSheet.findOne.mockResolvedValue(mockResult);

        const res = await BalanceSheetService.getBalanceSheets();

        expect(mockBalanceSheet.findOne).toHaveBeenCalledWith({});
        expect(res).toEqual(mockResult);
      });
    });

    describe("getBalanceSheetByTickerYear", () => {
      it("should return a balance sheet by ticker and fiscal year", async () => {
        const ticker = "AAPL";
        const fiscalYear = "2024-12-31";
        const ticker_year = "aapl_2024-12-31";

        const mockResult = { ticker: "aapl", fiscalYear, ticker_year };
        mockBalanceSheet.findOne.mockResolvedValue(mockResult);

        const res = await BalanceSheetService.getBalanceSheetByTickerYear(
          ticker,
          fiscalYear
        );

        expect(mockBalanceSheet.findOne).toHaveBeenCalledWith({ ticker_year });
        expect(res).toEqual(mockResult);
      });
    });

    describe("getBalanceSheetsByTicker", () => {
      it("should return balance sheets sorted by fiscal year", async () => {
        const ticker = "AAPL";
        const formattedTicker = "aapl";
        const mockResult = [
          { ticker: formattedTicker, fiscalYear: "2024-12-31" },
          { ticker: formattedTicker, fiscalYear: "2023-12-31" },
        ];

        const sortMock = { sort: jest.fn().mockResolvedValue(mockResult) };
        mockBalanceSheet.find.mockReturnValue(sortMock as any);

        const res = await BalanceSheetService.getBalanceSheetsByTicker(ticker);

        expect(mockBalanceSheet.find).toHaveBeenCalledWith({
          ticker: formattedTicker,
        });
        expect(sortMock.sort).toHaveBeenCalledWith({ fiscalYear: -1 });
        expect(res).toEqual(mockResult);
      });
    });
  });

  describe("updateBalanceSheet", () => {
    let mockBalanceSheet: jest.Mocked<typeof BalanceSheet>;

    beforeEach(() => {
      mockBalanceSheet = BalanceSheet as jest.Mocked<typeof BalanceSheet>;
      jest.clearAllMocks();
    });

    it("should update and return the updated balance sheet", async () => {
      const ticker = "AAPL";
      const year = "2024";
      const updates = { raw: { assets: 2000 } };

      const mockUpdated = {
        ticker: "aapl",
        year,
        raw: { assets: 2000 },
      };

      mockBalanceSheet.findOneAndUpdate.mockResolvedValue(mockUpdated);

      const res = await BalanceSheetService.updateBalanceSheet(
        ticker,
        year,
        updates
      );

      expect(mockBalanceSheet.findOneAndUpdate).toHaveBeenCalledWith(
        { ticker_year: "aapl_2024" },
        { $set: updates },
        { new: true, runValidators: true }
      );
      expect(res).toEqual(mockUpdated);
    });
  });

  describe("deleteBalanceSheet", () => {
    let mockBalanceSheet: jest.Mocked<typeof BalanceSheet>;

    beforeEach(() => {
      mockBalanceSheet = BalanceSheet as jest.Mocked<typeof BalanceSheet>;
      jest.clearAllMocks();
    });

    it("should delete and return the deleted balance sheet", async () => {
      const ticker = "AAPL";
      const year = "2023";

      const mockDeleted = {
        ticker: "aapl",
        fiscalYear: "2023-12-30",
        ticker_year: "aapl_2023",
        raw: { assets: 1000 },
      };

      mockBalanceSheet.findOneAndDelete.mockResolvedValue(mockDeleted);

      const res = await BalanceSheetService.deleteBalanceSheet(ticker, year);

      expect(mockBalanceSheet.findOneAndDelete).toHaveBeenCalledWith({
        ticker_year: "aapl_2023",
      });
      expect(res).toEqual(mockDeleted);
    });
  });
});
