import statementFetchController from "../../../controllers/statementFetchController";
import StatementFetchService from "../../../services/StatementFetchService";
import ProfileService from "../../../services/ProfileService";
import { Request, Response, NextFunction } from "express";

// filepath: src/tests/unit/controllers/statementFetchController.test.ts

// Mock dependencies
jest.mock("../../../services/StatementFetchService");
jest.mock("../../../services/ProfileService");

describe("statementFetchController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("allStatementsFetch", () => {
    it("should respond 202 and process tickers from query (success case)", async () => {
      req.query = { tickers: "AAPL,MSFT", period: "annual", limit: "2" };
      (StatementFetchService.fetchBalanceSheets as jest.Mock).mockResolvedValue(
        new Promise(() => "balanceSheet")
      );
      (
        StatementFetchService.fetchIncomeStatements as jest.Mock
      ).mockResolvedValue(new Promise(() => "incomeStatement"));
      (
        StatementFetchService.fetchCashflowStatements as jest.Mock
      ).mockResolvedValue(new Promise(() => "cashflowStatement"));

      await statementFetchController.allStatementsFetch(
        req as Request,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        message:
          "Request accepted. Statements will be fetched in the background.",
      });
    });

    it("should fetch all tickers from ProfileService if tickers not provided", async () => {
      req.query = {};
      (ProfileService.getTickers as jest.Mock).mockResolvedValue([
        { ticker: "AAPL" },
        { ticker: "GOOG" },
      ]);
      (StatementFetchService.fetchBalanceSheets as jest.Mock).mockResolvedValue(
        new Promise(() => "balanceSheet")
      );
      (
        StatementFetchService.fetchIncomeStatements as jest.Mock
      ).mockResolvedValue(new Promise(() => "incomeStatement"));
      (
        StatementFetchService.fetchCashflowStatements as jest.Mock
      ).mockResolvedValue(new Promise(() => "cashflowStatement"));

      await statementFetchController.allStatementsFetch(
        req as Request,
        res as Response,
        next
      );

      expect(ProfileService.getTickers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        message:
          "Request accepted. Statements will be fetched in the background.",
      });
    });

    it("should call next with error if thrown before response (failure case)", async () => {
      req.query = {};
      const error = new Error("ProfileService failed");
      (ProfileService.getTickers as jest.Mock).mockRejectedValue(error);

      await statementFetchController.allStatementsFetch(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should handle edge case: empty tickers string", async () => {
      req.query = { tickers: "" };

      (ProfileService.getTickers as jest.Mock).mockResolvedValue([
        { ticker: "AAPL" },
        { ticker: "GOOG" },
      ]);

      (StatementFetchService.fetchBalanceSheets as jest.Mock).mockResolvedValue(
        new Promise(() => "balanceSheet")
      );
      (
        StatementFetchService.fetchIncomeStatements as jest.Mock
      ).mockResolvedValue(new Promise(() => "incomeStatement"));
      (
        StatementFetchService.fetchCashflowStatements as jest.Mock
      ).mockResolvedValue(new Promise(() => "cashflowStatement"));

      await statementFetchController.allStatementsFetch(
        req as Request,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        message:
          "Request accepted. Statements will be fetched in the background.",
      });
    });
  });

  describe("balanceSheetFetch", () => {
    it("should fetch balance sheets and respond 201 (success case)", async () => {
      req.query = { ticker: "AAPL", period: "annual", limit: "2" };
      (StatementFetchService.fetchBalanceSheets as jest.Mock).mockResolvedValue(
        { data: "balance" }
      );

      await statementFetchController.balanceSheetFetch(
        req as Request,
        res as Response,
        next
      );

      expect(StatementFetchService.fetchBalanceSheets).toHaveBeenCalledWith({
        ticker: "AAPL",
        period: "annual",
        limit: "2",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: "balance" });
    });

    it("should call next with error if fetchBalanceSheets throws (failure case)", async () => {
      req.query = { ticker: "AAPL" };
      const error = new Error("fetch error");
      (StatementFetchService.fetchBalanceSheets as jest.Mock).mockRejectedValue(
        error
      );

      await statementFetchController.balanceSheetFetch(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should handle edge case: missing ticker", async () => {
      req.query = {};
      (StatementFetchService.fetchBalanceSheets as jest.Mock).mockResolvedValue(
        { data: "empty" }
      );

      await statementFetchController.balanceSheetFetch(
        req as Request,
        res as Response,
        next
      );

      expect(StatementFetchService.fetchBalanceSheets).toHaveBeenCalledWith({
        ticker: undefined,
        period: "annual",
        limit: "10",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: "empty" });
    });
  });

  describe("incomeFetch", () => {
    it("should fetch income statements and respond 201 (success case)", async () => {
      req.query = { ticker: "AAPL", period: "annual", limit: "2" };
      (
        StatementFetchService.fetchIncomeStatements as jest.Mock
      ).mockResolvedValue({ data: "income" });

      await statementFetchController.incomeFetch(
        req as Request,
        res as Response,
        next
      );

      expect(StatementFetchService.fetchIncomeStatements).toHaveBeenCalledWith({
        ticker: "AAPL",
        period: "annual",
        limit: "2",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: "income" });
    });

    it("should call next with error if fetchIncomeStatements throws (failure case)", async () => {
      req.query = { ticker: "AAPL" };
      const error = new Error("income error");
      (
        StatementFetchService.fetchIncomeStatements as jest.Mock
      ).mockRejectedValue(error);

      await statementFetchController.incomeFetch(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should handle edge case: missing ticker", async () => {
      req.query = {};
      (
        StatementFetchService.fetchIncomeStatements as jest.Mock
      ).mockResolvedValue({ data: "empty" });

      await statementFetchController.incomeFetch(
        req as Request,
        res as Response,
        next
      );

      expect(StatementFetchService.fetchIncomeStatements).toHaveBeenCalledWith({
        ticker: undefined,
        period: "annual",
        limit: "10",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: "empty" });
    });
  });

  describe("cashflowFetch", () => {
    it("should fetch cashflow statements and respond 201 (success case)", async () => {
      req.query = { ticker: "AAPL", period: "annual", limit: "2" };
      (
        StatementFetchService.fetchCashflowStatements as jest.Mock
      ).mockResolvedValue({ data: "cashflow" });

      await statementFetchController.cashflowFetch(
        req as Request,
        res as Response,
        next
      );

      expect(
        StatementFetchService.fetchCashflowStatements
      ).toHaveBeenCalledWith({
        ticker: "AAPL",
        period: "annual",
        limit: "2",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: "cashflow" });
    });

    it("should call next with error if fetchCashflowStatements throws (failure case)", async () => {
      req.query = { ticker: "AAPL" };
      const error = new Error("cashflow error");
      (
        StatementFetchService.fetchCashflowStatements as jest.Mock
      ).mockRejectedValue(error);

      await statementFetchController.cashflowFetch(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should handle edge case: missing ticker", async () => {
      req.query = {};
      (
        StatementFetchService.fetchCashflowStatements as jest.Mock
      ).mockResolvedValue({ data: "empty" });

      await statementFetchController.cashflowFetch(
        req as Request,
        res as Response,
        next
      );

      expect(
        StatementFetchService.fetchCashflowStatements
      ).toHaveBeenCalledWith({
        ticker: undefined,
        period: "annual",
        limit: "10",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: "empty" });
    });
  });
});
