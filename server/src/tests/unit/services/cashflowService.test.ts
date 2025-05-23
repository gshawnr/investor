import CashflowService from "../../../services/CashflowService";
import Cashflow from "../../../models/Cashflow";
import { ICashflow } from "../../../types/ICashflow";

jest.mock("../../../models/Cashflow");

describe("CashflowService", () => {
  let mockCashflow: jest.Mocked<typeof Cashflow>;

  beforeEach(() => {
    mockCashflow = Cashflow as jest.Mocked<typeof Cashflow>;
    jest.clearAllMocks();
  });

  describe("createCashflow", () => {
    it("should create a cash flow successfully", async () => {
      const inputData = {
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
        raw: { symbol: "AAPL", date: "2024-12-31", cashFromOps: 5000 },
      };

      mockCashflow.findOne.mockResolvedValue(null);

      const mockSave = jest.fn().mockResolvedValue({
        ticker: "aapl",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData.raw,
      });

      (mockCashflow as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));

      const res = await CashflowService.createCashflow(inputData);

      expect(mockCashflow).toHaveBeenCalledWith({
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData.raw,
      });
      expect(mockSave).toHaveBeenCalled();
      expect(res).toEqual({
        ticker: "aapl",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData.raw,
      });
    });

    it("should throw an error if cash flow already exists", async () => {
      const inputData: Partial<ICashflow> = {
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
      };

      mockCashflow.findOne.mockResolvedValue({});

      await expect(CashflowService.createCashflow(inputData)).rejects.toThrow(
        "Cashflow for aapl_2024 already exists."
      );

      expect(mockCashflow).not.toHaveBeenCalledWith(
        expect.objectContaining({ raw: inputData })
      );
    });
  });

  describe("Read Operations", () => {
    it("getCashflows should return all cash flows", async () => {
      const mockResult = [{ ticker: "aapl", fiscalYear: "2024-12-31" }];
      mockCashflow.find.mockResolvedValue(mockResult);

      const res = await CashflowService.getCashflow();

      expect(mockCashflow.find).toHaveBeenCalledWith({});
      expect(res).toEqual(mockResult);
    });

    it("getCashflowByTickerYear should return a cash flow", async () => {
      const mockResult = { ticker: "aapl", fiscalYear: "2023-12-31" };
      mockCashflow.findOne.mockResolvedValue(mockResult);

      const res = await CashflowService.getCashflowByTickerYear("AAPL", "2023");

      expect(mockCashflow.findOne).toHaveBeenCalledWith({
        ticker_year: "aapl_2023",
      });
      expect(res).toEqual(mockResult);
    });

    it("getCashflowsByTicker should return sorted cash flows", async () => {
      const mockResult = [
        { ticker: "aapl", fiscalYear: "2024-12-31" },
        { ticker: "aapl", fiscalYear: "2023-12-31" },
      ];

      const sortMock = { sort: jest.fn().mockResolvedValue(mockResult) };
      mockCashflow.find.mockReturnValue(sortMock as any);

      const res = await CashflowService.getCashflowsByTicker("AAPL");

      expect(mockCashflow.find).toHaveBeenCalledWith({ ticker: "aapl" });
      expect(sortMock.sort).toHaveBeenCalledWith({ fiscalYear: -1 });
      expect(res).toEqual(mockResult);
    });
  });

  describe("updateCashflow", () => {
    it("should update and return the updated cash flow", async () => {
      const updates = { raw: { cashFromOps: 9999 } };
      const mockUpdated = {
        ticker: "aapl",
        fiscalYear: "2024-12-31",
        raw: updates.raw,
      };

      mockCashflow.findOneAndUpdate.mockResolvedValue(mockUpdated);

      const res = await CashflowService.updateCashflow("AAPL", "2024", updates);

      expect(mockCashflow.findOneAndUpdate).toHaveBeenCalledWith(
        { ticker_year: "aapl_2024" },
        { $set: updates },
        { new: true, runValidators: true }
      );
      expect(res).toEqual(mockUpdated);
    });
  });

  describe("deleteCashflow", () => {
    it("should delete and return the deleted cash flow", async () => {
      const mockDeleted = {
        ticker: "aapl",
        fiscalYear: "2023-12-31",
        ticker_year: "aapl_2023",
      };

      mockCashflow.findOneAndDelete.mockResolvedValue(mockDeleted);

      const res = await CashflowService.deleteCashflow("AAPL", "2023");

      expect(mockCashflow.findOneAndDelete).toHaveBeenCalledWith({
        ticker_year: "aapl_2023",
      });
      expect(res).toEqual(mockDeleted);
    });
  });
});
