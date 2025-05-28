import express from "express";
import request from "supertest";
import cashflowRoutes from "../../../routes/cashflowRoutes";
import CashflowController from "../../../controllers/cashflowController";

// Mock the controller methods
jest.mock("../../../controllers/CashflowController", () => ({
  createCashflow: jest.fn((req, res) => res.status(201).send("created")),
  getCashflow: jest.fn((req, res) => res.status(200).send("fetched")),
  updateCashflow: jest.fn((req, res) => res.status(200).send("updated")),
  deleteCashflow: jest.fn((req, res) => res.status(200).send("deleted")),
}));

// Create an Express app using the routes
const app = express();
app.use(express.json());
app.use("/Cashflows", cashflowRoutes);

describe("Cashflow Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /Cashflows/", () => {
    it("should call createCashflow controller", async () => {
      const res = await request(app)
        .post("/Cashflows/")
        .send({ ticker: "AAPL", fiscalYear: "2024-12-31" });

      expect(res.status).toBe(201);
      expect(res.text).toBe("created");
      expect(CashflowController.createCashflow).toHaveBeenCalled();
    });
  });

  describe("GET /Cashflows/:ticker", () => {
    it("should call getCashflow controller", async () => {
      const res = await request(app).get("/Cashflows/AAPL");

      expect(res.status).toBe(200);
      expect(res.text).toBe("fetched");
      expect(CashflowController.getCashflow).toHaveBeenCalled();
    });
  });

  describe("PUT /Cashflows/:ticker/:year", () => {
    it("should call updateCashflow controller", async () => {
      const res = await request(app)
        .put("/Cashflows/AAPL/2024-12-31")
        .send({ raw: { cashFromOperations: 5000 } });

      expect(res.status).toBe(200);
      expect(res.text).toBe("updated");
      expect(CashflowController.updateCashflow).toHaveBeenCalled();
    });
  });

  describe("DELETE /Cashflows/:ticker/:year", () => {
    it("should call deleteCashflow controller", async () => {
      const res = await request(app).delete("/Cashflows/AAPL/2024-12-31");

      expect(res.status).toBe(200);
      expect(res.text).toBe("deleted");
      expect(CashflowController.deleteCashflow).toHaveBeenCalled();
    });
  });
});
