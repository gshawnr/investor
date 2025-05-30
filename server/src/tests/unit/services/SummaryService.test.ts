import SummaryService from "../../../services/SummaryService";
import Summary from "../../../models/Summary";
import SummaryGenerator from "../../../services/SummaryGeneratorService";
import { ISummary } from "../../../types/ISummary";

jest.mock("../../../models/Summary");
jest.mock("../../../services/SummaryGeneratorService");

describe("SummaryService", () => {
  let mockSummary: jest.Mocked<typeof Summary>;
  let mockSummaryGenerator: jest.Mocked<typeof SummaryGenerator>;

  beforeEach(() => {
    mockSummary = Summary as jest.Mocked<typeof Summary>;
    mockSummaryGenerator = SummaryGenerator as jest.Mocked<
      typeof SummaryGenerator
    >;

    jest.clearAllMocks();
  });

  describe("createSummaries", () => {
    it("should call SummaryGenerator.createSummaries with correct arguments", async () => {
      await SummaryService.createSummaries("AAPL", "2024");

      expect(mockSummaryGenerator.createSummaries).toHaveBeenCalledWith(
        "AAPL",
        "2024"
      );
    });

    it("should call SummaryGenerator.createSummaries without arguments when none provided", async () => {
      await SummaryService.createSummaries();

      expect(mockSummaryGenerator.createSummaries).toHaveBeenCalledWith(
        undefined,
        undefined
      );
    });
  });

  // describe("getSummary", () => {
  //   it("should return all summaries with default filter and options", async () => {
  //     const mockResult: ISummary[] = [
  //       {
  //         ticker: "aapl",
  //         fiscalYear: "2023",
  //         ticker_year: "aapl_2023",
  //       } as ISummary,
  //       {
  //         ticker: "aapl",
  //         fiscalYear: "2024",
  //         ticker_year: "aapl_2024",
  //       } as ISummary,
  //     ];
  //     mockSummary.find.mockResolvedValue(mockResult);

  //     const res = await SummaryService.getSummary();

  //     expect(mockSummary.find).toHaveBeenCalledWith({});
  //     expect(res).toEqual(mockResult);
  //   });

  //   it("should pass provided filter and options to Summary.find", async () => {
  //     const filter = { ticker: "aapl" };
  //     const options = { limit: 5, sort: { fiscalYear: -1 } };
  //     const mockResult: ISummary[] = [
  //       {
  //         ticker: "aapl",
  //         fiscalYear: "2024",
  //         ticker_year: "aapl_2024",
  //       } as ISummary,
  //     ];

  //     mockSummary.find.mockResolvedValue(mockResult);

  //     const res = await SummaryService.getSummary();

  //     expect(mockSummary.find).toHaveBeenCalledWith(filter, null, options);
  //     expect(res).toEqual(mockResult);
  //   });
  // });

  describe("getSummaryByTickerYear", () => {
    it("should return a summary by ticker and year", async () => {
      const ticker = "AAPL";
      const year = "2024";
      const ticker_year = "aapl_2024";

      const mockDoc = {
        ticker: "aapl",
        fiscalYear: year,
        ticker_year,
      } as ISummary;
      mockSummary.findOne.mockResolvedValue(mockDoc);

      const res = await SummaryService.getSummaryByTickerYear(ticker, year);

      expect(mockSummary.findOne).toHaveBeenCalledWith({ ticker_year });
      expect(res).toEqual(mockDoc);
    });
  });

  describe("updateSummary", () => {
    it("should update and return the updated summary", async () => {
      const ticker = "AAPL";
      const year = "2024";
      const updates: Partial<ISummary> = { beta: 1.5 };

      const mockUpdated = {
        ticker: "aapl",
        fiscalYear: year,
        beta: 1.5,
      } as ISummary;
      mockSummary.findOneAndUpdate.mockResolvedValue(mockUpdated);

      const res = await SummaryService.updateSummary(ticker, year, updates);

      expect(mockSummary.findOneAndUpdate).toHaveBeenCalledWith(
        { ticker_year: "aapl_2024" },
        { $set: updates },
        { new: true, runValidators: true }
      );
      expect(res).toEqual(mockUpdated);
    });
  });

  describe("deleteSummary", () => {
    it("should delete and return the deleted summary", async () => {
      const ticker = "AAPL";
      const year = "2023";
      const mockDeleted = {
        ticker: "aapl",
        fiscalYear: "2023",
        ticker_year: "aapl_2023",
      } as ISummary;

      mockSummary.findOneAndDelete.mockResolvedValue(mockDeleted);

      const res = await SummaryService.deleteSummary(ticker, year);

      expect(mockSummary.findOneAndDelete).toHaveBeenCalledWith({
        ticker_year: "aapl_2023",
      });
      expect(res).toEqual(mockDeleted);
    });
  });
});
