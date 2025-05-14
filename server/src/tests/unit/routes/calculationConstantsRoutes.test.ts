import express from "express";
import request from "supertest";
import calculationConstantsRoutes from "../../../routes/calculationContantsRoutes";
import calculationConstantsController from "../../../controllers/calculationConstantsController";

// Mock the controller methods
jest.mock("../../../controllers/calculationConstantsController", () => ({
  createCalculationConstants: jest.fn((req, res) =>
    res.status(201).send("created")
  ),
  getCalculationConstants: jest.fn((req, res) =>
    res.status(200).send("fetched")
  ),
  updateCalculationConstants: jest.fn((req, res) =>
    res.status(200).send("updated")
  ),
  deleteCalculationConstants: jest.fn((req, res) =>
    res.status(200).send("deleted")
  ),
}));

// Create Express app and use the routes
const app = express();
app.use(express.json());
app.use("/calculation-constants", calculationConstantsRoutes);

describe("CalculationConstants Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /calculation-constants/", () => {
    it("should call createCalculationConstants controller", async () => {
      const res = await request(app)
        .post("/calculation-constants/")
        .send({ year: "2024", constants: { discountRate: 0.1 } });

      expect(res.status).toBe(201);
      expect(res.text).toBe("created");
      expect(
        calculationConstantsController.createCalculationConstants
      ).toHaveBeenCalled();
    });
  });

  describe("GET /calculation-constants/:year", () => {
    it("should call getCalculationConstants controller with year", async () => {
      const res = await request(app).get("/calculation-constants/2024");

      expect(res.status).toBe(200);
      expect(res.text).toBe("fetched");
      expect(
        calculationConstantsController.getCalculationConstants
      ).toHaveBeenCalled();
    });
  });

  describe("GET /calculation-constants/", () => {
    it("should call getCalculationConstants controller without year", async () => {
      const res = await request(app).get("/calculation-constants/");

      expect(res.status).toBe(200);
      expect(res.text).toBe("fetched");
      expect(
        calculationConstantsController.getCalculationConstants
      ).toHaveBeenCalled();
    });
  });

  describe("PATCH /calculation-constants/:year", () => {
    it("should call updateCalculationConstants controller", async () => {
      const res = await request(app)
        .patch("/calculation-constants/2024")
        .send({ constants: { discountRate: 0.15 } });

      expect(res.status).toBe(200);
      expect(res.text).toBe("updated");
      expect(
        calculationConstantsController.updateCalculationConstants
      ).toHaveBeenCalled();
    });
  });

  describe("DELETE /calculation-constants/:year", () => {
    it("should call deleteCalculationConstants controller", async () => {
      const res = await request(app).delete("/calculation-constants/2024");

      expect(res.status).toBe(200);
      expect(res.text).toBe("deleted");
      expect(
        calculationConstantsController.deleteCalculationConstants
      ).toHaveBeenCalled();
    });
  });
});
