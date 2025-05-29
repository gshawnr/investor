import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import ExchangeRate from "../../../models/ExchangeRate";
import { IExchangeRate } from "../../../types/IExchangeRate";

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

beforeEach(async () => {
  await ExchangeRate.deleteMany({});
});

afterEach(async () => {
  await ExchangeRate.deleteMany({});
});

describe("ExchangeRate Model", () => {
  it("should save a valid exchange rate document", async () => {
    const validData = {
      currency_year: "USD_2024",
      year: "2024",
      currency: "USD",
      rateToUSD: 1.0,
    };

    const doc = new ExchangeRate(validData);
    const savedDoc = await doc.save();

    expect(savedDoc._id).toBeDefined();
    expect(savedDoc.currency).toBe("USD");
    expect(savedDoc.year).toBe(validData.year);
    expect(savedDoc.currency_year).toBe(validData.currency_year);
    expect(savedDoc.rateToUSD).toBe(validData.rateToUSD);
    expect(savedDoc.createdAt).toBeDefined();
    expect(savedDoc.updatedAt).toBeDefined();

    // Ensure createdAt and updatedAt are set correctly
    const castDoc = savedDoc as IExchangeRate;
    if (castDoc.createdAt && castDoc.updatedAt) {
      expect(new Date(castDoc.createdAt).getTime()).toBeCloseTo(
        new Date(castDoc.updatedAt).getTime(),
        -1000
      ); // within 1 second difference
    }
  });

  it("should throw validation error if required fields are missing", async () => {
    const invalidData = new ExchangeRate({});

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await invalidData.save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    expect(err).toBeDefined();
    expect(err?.errors.currency_year).toBeDefined();
    expect(err?.errors.year).toBeDefined();
    expect(err?.errors.currency).toBeDefined();
    expect(err?.errors.rateToUSD).toBeDefined();
  });

  it("should throw validation error if currency_year is not unique", async () => {
    const validData = {
      currency_year: "USD_2024",
      year: "2024",
      currency: "USD",
      rateToUSD: 1.0,
    };

    const doc1 = new ExchangeRate(validData);
    await doc1.save();

    const doc2 = new ExchangeRate(validData);

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await doc2.save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    expect(err).toBeDefined();
    expect(err?.message).toMatch(/duplicate key/); // Check for duplicate key error
  });
});
