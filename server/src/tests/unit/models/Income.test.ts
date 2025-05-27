import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Income from "../../../models/Income";
import { IIncome } from "../../../types/IIncome";

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
  await Income.deleteMany({});
});

describe("Income Model", () => {
  it("should save a valid income document", async () => {
    const validData = {
      ticker: "AAPL",
      fiscalYear: "2023",
      ticker_year: "aapl_2023",
      raw: {
        ticker: "AAPL",
        fiscalYear: "2023",
        revenue: 100000,
      },
    };

    const doc = new Income(validData);
    const savedDoc = await doc.save();

    expect(savedDoc._id).toBeDefined();
    expect(savedDoc.ticker).toBe("aapl"); // lowercase conversion
    expect(savedDoc.fiscalYear).toBe(validData.fiscalYear);
    expect(savedDoc.ticker_year).toBe(validData.ticker_year);
    expect(savedDoc.raw).toEqual(validData.raw);

    const castDoc = savedDoc as IIncome;
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
    const invalidData = new Income({});

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
    const invalidData = new Income({
      ticker: "AAPL",
      fiscalYear: "09-30-2023", // invalid format
      ticker_year: "aapl_2023",
      raw: { revenue: 100000 },
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
      fiscalYear: "2023",
      ticker_year: "aapl_2023",
      raw: {
        ticker: "AAPL",
        fiscalYear: "2023",
        revenue: 100000,
      },
    };

    const valid = new Income(data);
    const res = await valid.save();

    let err: mongoose.Error | null = null;
    try {
      const invalid = new Income(data);
      const res = await invalid.save();
    } catch (error) {
      err = error as mongoose.Error;
    }

    expect(err).toBeDefined();
    expect(err?.message).toMatch(/duplicate key/);
  });
});
