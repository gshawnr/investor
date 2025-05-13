import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import BalanceSheet from "../../../models/BalanceSheet";
import { IBalanceSheet } from "../../../types/IBalanceSheet";

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
  await BalanceSheet.deleteMany({});
});

describe("BalanceSheet Model", () => {
  it("should save a valid balance sheet document", async () => {
    const validData = {
      ticker: "AAPL",
      fiscalYear: "2024-12-31",
      ticker_year: "aapl_2024",
      raw: {
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
        assets: 1000,
      },
    };

    const doc = new BalanceSheet(validData);
    const savedDoc = await doc.save();

    expect(savedDoc._id).toBeDefined();
    expect(savedDoc.ticker).toBe("aapl"); // lowercase conversion
    expect(savedDoc.fiscalYear).toBe(validData.fiscalYear);
    expect(savedDoc.ticker_year).toBe(validData.ticker_year);
    expect(savedDoc.raw).toEqual(validData.raw);

    // Check if timestamps are set and valid
    expect((savedDoc as IBalanceSheet).createdAt).toBeDefined();
    expect((savedDoc as IBalanceSheet).updatedAt).toBeDefined();

    // Ensure createdAt and updatedAt are set correctly
    const castDoc = savedDoc as IBalanceSheet;
    if (castDoc.createdAt && castDoc.updatedAt) {
      expect(new Date(castDoc.createdAt).getTime()).toBeCloseTo(
        new Date(castDoc.updatedAt).getTime(),
        -1000
      ); // within 1 second difference
    }
  });

  it("should throw validation error if required fields are missing", async () => {
    const invalidData = new BalanceSheet({});

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
    const invalidData = new BalanceSheet({
      ticker: "aapl",
      fiscalYear: "2024/12/31", // wrong format
      ticker_year: "aapl_2024",
      raw: {
        ticker: "AAPL",
        fiscalYear: "2024-12-31", // wrong format
        assets: 1000,
      },
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
      ticker: "aapl",
      fiscalYear: "2024-12-31",
      ticker_year: "aapl_2024",
      raw: {
        ticker: "AAPL",
        fiscalYear: "2024-12-31",
        assets: 1000,
      },
    };

    await new BalanceSheet(data).save();

    let err: mongoose.Error | null = null;
    try {
      await new BalanceSheet(data).save();
    } catch (error) {
      err = error as mongoose.Error;
    }

    expect(err).toBeDefined();
    expect(err?.message).toMatch(/duplicate key/);
  });
});
