import express from "express";
import request from "supertest";
import balanceSheetRoutes from "../../../routes/balanceSheetRoutes";
import BalanceSheetController from "../../../controllers/balanceSheetController";

// Mock the controller methods
jest.mock("../../../controllers/balanceSheetController", () => ({
  createBalanceSheet: jest.fn((req, res) => res.status(201).send("created")),
  getBalanceSheet: jest.fn((req, res) => res.status(200).send("fetched")),
  updateBalanceSheet: jest.fn((req, res) => res.status(200).send("updated")),
  deleteBalanceSheet: jest.fn((req, res) => res.status(200).send("deleted")),
}));

// Create an Express app using the routes
const app = express();
app.use(express.json());
app.use("/balance-sheets", balanceSheetRoutes);

describe("BalanceSheet Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /balance-sheets/", () => {
    it("should call createBalanceSheet controller", async () => {
      const res = await request(app)
        .post("/balance-sheets/")
        .send({ ticker: "AAPL", fiscalYear: "2024-12-31" });

      expect(res.status).toBe(201);
      expect(res.text).toBe("created");
      expect(BalanceSheetController.createBalanceSheet).toHaveBeenCalled();
    });
  });

  describe("GET /balance-sheets/:ticker", () => {
    it("should call getBalanceSheet controller", async () => {
      const res = await request(app).get("/balance-sheets/AAPL");

      expect(res.status).toBe(200);
      expect(res.text).toBe("fetched");
      expect(BalanceSheetController.getBalanceSheet).toHaveBeenCalled();
    });
  });

  describe("PUT /balance-sheets/:ticker/:fiscalYear", () => {
    it("should call updateBalanceSheet controller", async () => {
      const res = await request(app)
        .put("/balance-sheets/AAPL/2024-12-31")
        .send({ raw: { assets: 2000 } });

      expect(res.status).toBe(200);
      expect(res.text).toBe("updated");
      expect(BalanceSheetController.updateBalanceSheet).toHaveBeenCalled();
    });
  });

  describe("DELETE /balance-sheets/:ticker/:fiscalYear", () => {
    it("should call deleteBalanceSheet controller", async () => {
      const res = await request(app).delete("/balance-sheets/AAPL/2024-12-31");

      expect(res.status).toBe(200);
      expect(res.text).toBe("deleted");
      expect(BalanceSheetController.deleteBalanceSheet).toHaveBeenCalled();
    });
  });
});
