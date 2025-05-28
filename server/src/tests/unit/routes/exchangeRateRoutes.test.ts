import express from "express";
import request from "supertest";
import exchangeRateRoutes from "../../../routes/exchangeRateRoutes";
import exchangeRateController from "../../../controllers/exchangeRateController";

// Mock the controller methods
jest.mock("../../../controllers/exchangeRateController", () => ({
  createExchangeRate: jest.fn((req, res) => res.status(201).send("created")),
  getExchangeRates: jest.fn((req, res) => res.status(200).send("fetched")),
  updateExchangeRate: jest.fn((req, res) => res.status(200).send("updated")),
  deleteExchangeRate: jest.fn((req, res) => res.status(204).send()),
}));

// Set up Express app
const app = express();
app.use(express.json());
app.use("/exchange-rates", exchangeRateRoutes);

describe("ExchangeRate Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /exchange-rates/", () => {
    it("should call createExchangeRate controller", async () => {
      const res = await request(app)
        .post("/exchange-rates/")
        .send({ currency: "USD", year: "2024", rate: 1.25 });

      expect(res.status).toBe(201);
      expect(res.text).toBe("created");
      expect(exchangeRateController.createExchangeRate).toHaveBeenCalled();
    });
  });

  describe("GET /exchange-rates/", () => {
    it("should call getExchangeRates controller", async () => {
      const res = await request(app).get(
        "/exchange-rates?currency=USD&year=2024"
      );

      expect(res.status).toBe(200);
      expect(res.text).toBe("fetched");
      expect(exchangeRateController.getExchangeRates).toHaveBeenCalled();
    });
  });

  describe("PATCH /exchange-rates/:currency/:year", () => {
    it("should call updateExchangeRate controller", async () => {
      const res = await request(app)
        .patch("/exchange-rates/USD/2024")
        .send({ rate: 1.3 });

      expect(res.status).toBe(200);
      expect(res.text).toBe("updated");
      expect(exchangeRateController.updateExchangeRate).toHaveBeenCalled();
    });
  });

  describe("DELETE /exchange-rates/:currency/:year", () => {
    it("should call deleteExchangeRate controller", async () => {
      const res = await request(app).delete("/exchange-rates/USD/2024");

      expect(res.status).toBe(204);
      expect(res.text).toBe(""); // no content
      expect(exchangeRateController.deleteExchangeRate).toHaveBeenCalled();
    });
  });
});
