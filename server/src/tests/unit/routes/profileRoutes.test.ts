import express from "express";
import request from "supertest";
import profileRoutes from "../../../routes/profileRoutes";
import profileController from "../../../controllers/profileController";

// Mock the controller methods
jest.mock("../../../controllers/profileController", () => ({
  createProfile: jest.fn((req, res) => res.status(201).send("created")),
  getProfile: jest.fn((req, res) => res.status(200).send("fetched")),
  getAllProfiles: jest.fn((req, res) => res.status(200).send("fetched")),
  updateProfile: jest.fn((req, res) => res.status(200).send("updated")),
  deleteProfile: jest.fn((req, res) => res.status(200).send("deleted")),
}));

// Create an Express app using the routes
const app = express();
app.use(express.json());
app.use("/profiles", profileRoutes);

describe("Profile Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /profiles/", () => {
    it("should call createProfile controller", async () => {
      const res = await request(app)
        .post("/profiles/")
        .send({ ticker: "AAPL", fiscalYear: "2024-12-31" });

      expect(res.status).toBe(201);
      expect(res.text).toBe("created");
      expect(profileController.createProfile).toHaveBeenCalled();
    });
  });

  describe("GET /profiles/:ticker", () => {
    it("should call getProfile controller", async () => {
      const res = await request(app).get("/profiles/AAPL");

      expect(res.status).toBe(200);
      expect(res.text).toBe("fetched");
      expect(profileController.getProfile).toHaveBeenCalled();
    });
  });

  describe("PUT /profiles/:ticker", () => {
    it("should call updateProfile controller", async () => {
      const res = await request(app)
        .put("/profiles/AAPL")
        .send({ raw: { company: "Apple Inc" } });

      expect(res.status).toBe(200);
      expect(res.text).toBe("updated");
      expect(profileController.updateProfile).toHaveBeenCalled();
    });
  });

  describe("DELETE /profiles/:ticker", () => {
    it("should call deleteProfile controller", async () => {
      const res = await request(app).delete("/profiles/AAPL");

      expect(res.status).toBe(200);
      expect(res.text).toBe("deleted");
      expect(profileController.deleteProfile).toHaveBeenCalled();
    });
  });
});
