import express from "express";
import request from "supertest";
import summaryRoutes from "../../../routes/summaryRoutes";
import summaryController from "../../../controllers/summaryController";

// Mock the controller method
jest.mock("../../../controllers/summaryController", () => ({
  createSummary: jest.fn((req, res) => res.status(201).send("summary created")),
  getSummaries: jest.fn((req, res) =>
    res.status(200).send("summaries fetched")
  ),
}));

const app = express();
app.use(express.json());
app.use("/summaries", summaryRoutes);

describe("Summary Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /summaries/", () => {
    it("should call createSummary controller", async () => {
      const res = await request(app)
        .post("/summaries/")
        .send({ ticker: "AAPL", data: { revenue: 10000 } });

      expect(res.status).toBe(201);
      expect(res.text).toBe("summary created");
      expect(summaryController.createSummary).toHaveBeenCalled();
    });
  });

  describe("GET /summaries/", () => {
    it("should call getSummaries controller", async () => {
      const res = await request(app).get("/summaries/");

      expect(res.status).toBe(200);
      expect(res.text).toBe("summaries fetched");
      expect(summaryController.getSummaries).toHaveBeenCalled();
    });
  });
});
