// __tests__/models/CalculationConstants.test.ts

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import CalculationConstants from "../../../models/CalculationConstants";
import { ICalculationContants } from "../../../types/ICalculationConstants";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await CalculationConstants.deleteMany({});
});

describe("CalculationConstants Model", () => {
  it("should save a valid document", async () => {
    const validData = {
      year: "2024",
      riskFreeRate: 0.03,
      equityRiskPremium: 0.05,
      costOfDebt: 0.04,
      taxRate: 0.25,
    };

    const doc = new CalculationConstants(validData);
    const savedDoc = await doc.save();

    expect(savedDoc._id).toBeDefined();
    expect(savedDoc.year).toBe(validData.year);
    expect(savedDoc.riskFreeRate).toBe(validData.riskFreeRate);
    expect(savedDoc.equityRiskPremium).toBe(validData.equityRiskPremium);
    expect(savedDoc.costOfDebt).toBe(validData.costOfDebt);
    expect(savedDoc.taxRate).toBe(validData.taxRate);

    // Check timestamps
    const castDoc = savedDoc as ICalculationContants;
    expect(castDoc.createdAt).toBeDefined();
    expect(castDoc.updatedAt).toBeDefined();

    if (castDoc.createdAt && castDoc.updatedAt) {
      expect(new Date(castDoc.createdAt).getTime()).toBeCloseTo(
        new Date(castDoc.updatedAt).getTime(),
        -1000
      );
    }
  });

  it("should throw validation error if required fields are missing", async () => {
    const invalidDoc = new CalculationConstants({});

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await invalidDoc.save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    expect(err).toBeDefined();
    expect(err?.errors.year).toBeDefined();
    expect(err?.errors.riskFreeRate).toBeDefined();
    expect(err?.errors.equityRiskPremium).toBeDefined();
    expect(err?.errors.costOfDebt).toBeDefined();
    expect(err?.errors.taxRate).toBeDefined();
  });

  it("should enforce unique constraint on year", async () => {
    const data = {
      year: "2024",
      riskFreeRate: 0.03,
      equityRiskPremium: 0.05,
      costOfDebt: 0.04,
      taxRate: 0.25,
    };

    const res = await new CalculationConstants(data).save();

    let err: mongoose.Error | null = null;
    try {
      const res = await new CalculationConstants(data).save();
    } catch (error) {
      err = error as mongoose.Error;
    }

    expect(err).toBeDefined();
    expect(err?.message).toMatch(/duplicate key/);
  });
});
