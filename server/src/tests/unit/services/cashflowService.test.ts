import CashflowService from "../../../services/CashflowService";
import Cashflow from "../../../models/Cashflow";
import { ICashflow } from "../../../types/ICashflow";

jest.mock("../../../models/Cashflow");

describe("CashflowService", () => {
  let mockCashFlow: jest.Mocked<typeof Cashflow>;

  beforeEach(() => {
    mockCashFlow = Cashflow as jest.Mocked<typeof Cashflow>;
    jest.clearAllMocks();
  });

  describe("createCashFlow", () => {
    it("should create a cash flow successfully", async () => {
      const inputData = {
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
        cashFromOps: 5000,
      };

      mockCashFlow.findOne.mockResolvedValue(null);

      const mockSave = jest.fn().mockResolvedValue({
        ticker: "aapl",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData,
      });

      (mockCashFlow as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));

      const res = await CashflowService.createCashFlow(inputData);

      expect(mockCashFlow).toHaveBeenCalledWith({
        ticker: "aapl",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData,
      });
      expect(mockSave).toHaveBeenCalled();
      expect(res).toEqual({
        ticker: "aapl",
        fiscalYear: "2024-12-31",
        ticker_year: "aapl_2024",
        raw: inputData,
      });
    });

    it("should throw an error if cash flow already exists", async () => {
      const inputData: Partial<ICashflow> = {
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
      };

      mockCashFlow.findOne.mockResolvedValue({});

      await expect(CashflowService.createCashFlow(inputData)).rejects.toThrow(
        "CashFlow for aapl_2024 already exists."
      );

      expect(mockCashFlow).not.toHaveBeenCalledWith(
        expect.objectContaining({ raw: inputData })
      );
    });
  });

  describe("Read Operations", () => {
    it("getCashFlows should return all cash flows", async () => {
      const mockResult = [{ ticker: "aapl", fiscalYear: "2024-12-31" }];
      mockCashFlow.find.mockResolvedValue(mockResult);

      const res = await CashflowService.getCashFlows();

      expect(mockCashFlow.find).toHaveBeenCalledWith({});
      expect(res).toEqual(mockResult);
    });

    it("getCashFlowByTickerYear should return a cash flow", async () => {
      const mockResult = { ticker: "aapl", fiscalYear: "2023-12-31" };
      mockCashFlow.findOne.mockResolvedValue(mockResult);

      const res = await CashflowService.getCashFlowByTickerYear("AAPL", "2023");

      expect(mockCashFlow.findOne).toHaveBeenCalledWith({
        ticker_year: "aapl_2023",
      });
      expect(res).toEqual(mockResult);
    });

    it("getCashFlowsByTicker should return sorted cash flows", async () => {
      const mockResult = [
        { ticker: "aapl", fiscalYear: "2024-12-31" },
        { ticker: "aapl", fiscalYear: "2023-12-31" },
      ];

      const sortMock = { sort: jest.fn().mockResolvedValue(mockResult) };
      mockCashFlow.find.mockReturnValue(sortMock as any);

      const res = await CashflowService.getCashFlowsByTicker("AAPL");

      expect(mockCashFlow.find).toHaveBeenCalledWith({ ticker: "aapl" });
      expect(sortMock.sort).toHaveBeenCalledWith({ fiscalYear: -1 });
      expect(res).toEqual(mockResult);
    });
  });

  describe("updateCashFlow", () => {
    it("should update and return the updated cash flow", async () => {
      const updates = { raw: { cashFromOps: 9999 } };
      const mockUpdated = {
        ticker: "aapl",
        fiscalYear: "2024-12-31",
        raw: updates.raw,
      };

      mockCashFlow.findOneAndUpdate.mockResolvedValue(mockUpdated);

      const res = await CashflowService.updateCashFlow(
        "AAPL",
        "2024-12-31",
        updates
      );

      expect(mockCashFlow.findOneAndUpdate).toHaveBeenCalledWith(
        { ticker_year: "aapl_2024" },
        { $set: updates },
        { new: true, runValidators: true }
      );
      expect(res).toEqual(mockUpdated);
    });
  });

  describe("deleteCashFlow", () => {
    it("should delete and return the deleted cash flow", async () => {
      const mockDeleted = {
        ticker: "aapl",
        fiscalYear: "2023-12-31",
        ticker_year: "aapl_2023",
      };

      mockCashFlow.findOneAndDelete.mockResolvedValue(mockDeleted);

      const res = await CashflowService.deleteCashFlow("AAPL", "2023");

      expect(mockCashFlow.findOneAndDelete).toHaveBeenCalledWith({
        ticker_year: "aapl_2023",
      });
      expect(res).toEqual(mockDeleted);
    });
  });
});
