import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Cashflow from "../../../models/Cashflow";
import { ICashflow } from "../../../types/ICashflow";

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
  await Cashflow.deleteMany({});
});

describe("Cashflow Model", () => {
  it("should save a valid Cashflow document", async () => {
    const validData = {
      ticker: "MSFT",
      fiscalYear: "2024-12-31",
      ticker_year: "msft_2024",
      raw: {
        ticker: "MSFT",
        fiscalYear: "2024-12-31",
        cashFromOperations: 5000,
      },
    };

    const doc = new Cashflow(validData);
    const savedDoc = await doc.save();

    expect(savedDoc._id).toBeDefined();
    expect(savedDoc.ticker).toBe("msft"); // lowercase conversion
    expect(savedDoc.fiscalYear).toBe(validData.fiscalYear);
    expect(savedDoc.ticker_year).toBe(validData.ticker_year);
    expect(savedDoc.raw).toEqual(validData.raw);

    // Check if timestamps are set and valid
    expect((savedDoc as ICashflow).createdAt).toBeDefined();
    expect((savedDoc as ICashflow).updatedAt).toBeDefined();

    const castDoc = savedDoc as ICashflow;
    if (castDoc.createdAt && castDoc.updatedAt) {
      expect(new Date(castDoc.createdAt).getTime()).toBeCloseTo(
        new Date(castDoc.updatedAt).getTime(),
        -1000 // within ~1 second difference
      );
    }
  });

  it("should throw validation error if required fields are missing", async () => {
    const invalidData = new Cashflow({});

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await invalidData.save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    expect(err).toBeDefined();
    expect(err?.errors.ticker).toBeDefined();
    expect(err?.errors.fiscalYear).toBeDefined();
    expect(err?.errors.ticker_year).toBeDefined();
    expect(err?.errors.raw).toBeDefined();
  });

  it("should fail if fiscalYear format is invalid", async () => {
    const invalidData = new Cashflow({
      ticker: "MSFT",
      fiscalYear: "2024/12/31", // wrong format
      ticker_year: "MSFT_2024",
      raw: { cashFromOperations: 5000 },
    });

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await invalidData.save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    expect(err).toBeDefined();
    expect(err?.errors.fiscalYear).toBeDefined();
  });

  it("should enforce unique constraint on ticker_year", async () => {
    const data = {
      ticker: "msft",
      fiscalYear: "2024-12-31",
      ticker_year: "MSFT_2024",
      raw: {
        ticker: "MSFT",
        fiscalYear: "2024-12-31",
        cashFromOperations: 5000,
      },
    };

    await new Cashflow(data).save();

    let err: mongoose.Error | null = null;
    try {
      await new Cashflow(data).save();
    } catch (error) {
      err = error as mongoose.Error;
    }

    expect(err).toBeDefined();
    expect(err?.message).toMatch(/duplicate key/);
  });
});
