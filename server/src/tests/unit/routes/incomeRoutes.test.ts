import express from "express";
import request from "supertest";
import incomeRoutes from "../../../routes/incomeRoutes";
import incomeController from "../../../controllers/incomeController";

// Mock the controller methods
jest.mock("../../../controllers/incomeController", () => ({
  createIncome: jest.fn((req, res) => res.status(201).send("created")),
  getIncome: jest.fn((req, res) => res.status(200).send("fetched")),
  updateIncome: jest.fn((req, res) => res.status(200).send("updated")),
  deleteIncome: jest.fn((req, res) => res.status(200).send("deleted")),
}));

// Create an Express app using the routes
const app = express();
app.use(express.json());
app.use("/income", incomeRoutes);

describe("Income Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /income/", () => {
    it("should call createIncome controller", async () => {
      const res = await request(app)
        .post("/income/")
        .send({ ticker: "AAPL", year: "2024", data: { revenue: 1000 } });

      expect(res.status).toBe(201);
      expect(res.text).toBe("created");
      expect(incomeController.createIncome).toHaveBeenCalled();
    });
  });

  describe("GET /income/:ticker", () => {
    it("should call getIncome controller", async () => {
      const res = await request(app).get("/income/AAPL");

      expect(res.status).toBe(200);
      expect(res.text).toBe("fetched");
      expect(incomeController.getIncome).toHaveBeenCalled();
    });
  });

  describe("PUT /income/:ticker/:year", () => {
    it("should call updateIncome controller", async () => {
      const res = await request(app)
        .put("/income/AAPL/2024")
        .send({ data: { revenue: 1200 } });

      expect(res.status).toBe(200);
      expect(res.text).toBe("updated");
      expect(incomeController.updateIncome).toHaveBeenCalled();
    });
  });

  describe("DELETE /income/:ticker/:year", () => {
    it("should call deleteIncome controller", async () => {
      const res = await request(app).delete("/income/AAPL/2024");

      expect(res.status).toBe(200);
      expect(res.text).toBe("deleted");
      expect(incomeController.deleteIncome).toHaveBeenCalled();
    });
  });
});
