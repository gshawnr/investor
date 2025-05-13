import express from "express";
import request from "supertest";
import cashflowRoutes from "../../../routes/cashFlowRoutes";
import CashflowController from "../../../controllers/cashflowController";

// Mock the controller methods
jest.mock("../../../controllers/cashflowController", () => ({
  createCashFlow: jest.fn((req, res) => res.status(201).send("created")),
  getCashFlow: jest.fn((req, res) => res.status(200).send("fetched")),
  updateCashFlow: jest.fn((req, res) => res.status(200).send("updated")),
  deleteCashFlow: jest.fn((req, res) => res.status(200).send("deleted")),
}));

// Create an Express app using the routes
const app = express();
app.use(express.json());
app.use("/cashflows", cashflowRoutes);

describe("Cashflow Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /cashflows/", () => {
    it("should call createCashFlow controller", async () => {
      const res = await request(app)
        .post("/cashflows/")
        .send({ ticker: "AAPL", fiscalYear: "2024-12-31" });

      expect(res.status).toBe(201);
      expect(res.text).toBe("created");
      expect(CashflowController.createCashFlow).toHaveBeenCalled();
    });
  });

  describe("GET /cashflows/:ticker", () => {
    it("should call getCashFlow controller", async () => {
      const res = await request(app).get("/cashflows/AAPL");

      expect(res.status).toBe(200);
      expect(res.text).toBe("fetched");
      expect(CashflowController.getCashFlow).toHaveBeenCalled();
    });
  });

  describe("PUT /cashflows/:ticker/:year", () => {
    it("should call updateCashFlow controller", async () => {
      const res = await request(app)
        .put("/cashflows/AAPL/2024-12-31")
        .send({ raw: { cashFromOperations: 5000 } });

      expect(res.status).toBe(200);
      expect(res.text).toBe("updated");
      expect(CashflowController.updateCashFlow).toHaveBeenCalled();
    });
  });

  describe("DELETE /cashflows/:ticker/:year", () => {
    it("should call deleteCashFlow controller", async () => {
      const res = await request(app).delete("/cashflows/AAPL/2024-12-31");

      expect(res.status).toBe(200);
      expect(res.text).toBe("deleted");
      expect(CashflowController.deleteCashFlow).toHaveBeenCalled();
    });
  });
});
