import express from "express";
import request from "supertest";
import metricRoutes from "../../../routes/metricRoutes";
import metricController from "../../../controllers/metricController";
import { parseQuery } from "../../../middleware/queryParser";

// Mock controller methods
jest.mock("../../../controllers/metricController", () => ({
  getMetrics: jest.fn((req, res) => res.status(200).send("metrics fetched")),
  createMetric: jest.fn((req, res) => res.status(201).send("metric created")),
}));

const app = express();
app.use(express.json());
app.use("/metrics", metricRoutes);

describe("Metric Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /metrics/", () => {
    it("should call getMetrics controller", async () => {
      const res = await request(app).get("/metrics/");

      expect(res.status).toBe(200);
      expect(res.text).toBe("metrics fetched");
      expect(metricController.getMetrics).toHaveBeenCalled();
    });
  });

  describe("POST /metrics/", () => {
    it("should call createMetric controller", async () => {
      const res = await request(app)
        .post("/metrics/")
        .send({ name: "ROIC", value: 15 });

      expect(res.status).toBe(201);
      expect(res.text).toBe("metric created");
      expect(metricController.createMetric).toHaveBeenCalled();
    });
  });
});
