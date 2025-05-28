import express from "express";
import request from "supertest";
import statementFetchRoutes from "../../../routes/statementFetchRoutes";
import statementFetchController from "../../../controllers/statementFetchController";

// Mock the controller methods
jest.mock("../../../controllers/statementFetchController", () => ({
  balanceSheetFetch: jest.fn((req, res) =>
    res.status(200).json({ message: "balance sheet fetched" })
  ),
  incomeFetch: jest.fn((req, res) =>
    res.status(200).json({ message: "income fetched" })
  ),
  cashflowFetch: jest.fn((req, res) =>
    res.status(200).json({ message: "cashflow fetched" })
  ),
  priceFetchByTicker: jest.fn((req, res) =>
    res.status(200).json({ message: "prices fetched" })
  ),
  updatePriceByTicker: jest.fn((req, res) =>
    res.status(200).json({ message: "prices fetched" })
  ),
  allStatementsFetch: jest.fn((req, res) =>
    res.status(200).json({ message: "all statements fetched" })
  ),
}));

describe("statementFetchRoutes", () => {
  const app = express();

  beforeEach(() => {
    app.use(express.json());
    app.use("/api/fetch", statementFetchRoutes);
    jest.clearAllMocks();
  });

  describe("GET /statements/balance-sheet", () => {
    it("should call balanceSheetFetch and return 200", async () => {
      const res = await request(app).get("/api/fetch/balance-sheet");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "balance sheet fetched" });
      expect(statementFetchController.balanceSheetFetch).toHaveBeenCalled();
    });

    it("should handle controller error", async () => {
      (
        statementFetchController.balanceSheetFetch as jest.Mock
      ).mockImplementationOnce((req, res) =>
        res.status(500).json({ error: "fail" })
      );
      const res = await request(app).get("/api/fetch/balance-sheet");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "fail" });
    });

    it("should handle edge case: missing query params", async () => {
      // No query params expected, but test for robustness
      const res = await request(app).get("/api/fetch/balance-sheet?unused=1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "balance sheet fetched" });
    });
  });

  describe("GET /statements/income", () => {
    it("should call incomeFetch and return 200", async () => {
      const res = await request(app).get("/api/fetch/income");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "income fetched" });
      expect(statementFetchController.incomeFetch).toHaveBeenCalled();
    });

    it("should handle controller error", async () => {
      (
        statementFetchController.incomeFetch as jest.Mock
      ).mockImplementationOnce((req, res) =>
        res.status(500).json({ error: "fail" })
      );
      const res = await request(app).get("/api/fetch/income");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "fail" });
    });

    it("should handle edge case: extra headers", async () => {
      const res = await request(app)
        .get("/api/fetch/income")
        .set("X-Test-Header", "test");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "income fetched" });
    });
  });

  describe("GET /statements/cashflow", () => {
    it("should call cashflowFetch and return 200", async () => {
      const res = await request(app).get("/api/fetch/cashflow");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "cashflow fetched" });
      expect(statementFetchController.cashflowFetch).toHaveBeenCalled();
    });

    it("should handle controller error", async () => {
      (
        statementFetchController.cashflowFetch as jest.Mock
      ).mockImplementationOnce((req, res) =>
        res.status(500).json({ error: "fail" })
      );
      const res = await request(app).get("/api/fetch/cashflow");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "fail" });
    });

    it("should handle edge case: empty body", async () => {
      const res = await request(app).get("/api/fetch/cashflow").send({});
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "cashflow fetched" });
    });
  });

  describe("GET /statements/all", () => {
    it("should call allStatementsFetch and return 200", async () => {
      const res = await request(app).get("/api/fetch/all");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "all statements fetched" });
      expect(statementFetchController.allStatementsFetch).toHaveBeenCalled();
    });

    it("should handle controller error", async () => {
      (
        statementFetchController.allStatementsFetch as jest.Mock
      ).mockImplementationOnce((req, res) =>
        res.status(500).json({ error: "fail" })
      );
      const res = await request(app).get("/api/fetch/all");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "fail" });
    });

    it("should handle edge case: unknown query param", async () => {
      const res = await request(app).get("/api/fetch/all?foo=bar");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "all statements fetched" });
    });
  });
});
