// tests/models/Metric.test.ts
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Metric from "../../../models/Metric"; // adjust the path as needed
import { IMetric } from "../../../types/IMetric";

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
  await Metric.deleteMany({});
});

describe("Metric Model", () => {
  const validData = {
    ticker: "AAPL",
    fiscalYear: "2024",
    ticker_year: "aapl_2024",
    avgStockPrice: 150.5,
    industry: "Technology",
    sector: "Information Technology",
    performanceData: {
      returnOnEquity: 0.25,
      salesToEquity: 1.5,
    },
    profitabilityData: {
      grossMargin: 0.55,
      netMargin: 0.1,
    },
    stabilityData: {
      debtToEquity: 0.6,
      debtToEbitda: 1.2,
      currentRatio: 2.5,
    },
    valueData: {
      dcfToAvgPrice: 1.1,
      dcfValuePerShare: 165.0,
      priceToEarnings: 30,
      earningsYield: 0.033,
      priceToSales: 5,
      priceToBook: 7,
    },
  };

  it("should save a valid metric document", async () => {
    const metric = new Metric(validData);
    const saved = await metric.save();

    expect(saved._id).toBeDefined();
    expect(saved.ticker).toBe("aapl");
    expect(saved.fiscalYear).toBe(validData.fiscalYear);
    expect(saved.ticker_year).toBe(validData.ticker_year);
    expect(saved.avgStockPrice).toBe(validData.avgStockPrice);
    expect(saved.performanceData.returnOnEquity).toBe(
      validData.performanceData.returnOnEquity
    );

    const castDoc = saved as IMetric;
    expect(castDoc.createdAt).toBeDefined();
    expect(castDoc.updatedAt).toBeDefined();
    if (castDoc.createdAt && castDoc.updatedAt) {
      expect(new Date(castDoc.createdAt).getTime()).toBeCloseTo(
        new Date(castDoc.updatedAt).getTime(),
        -1000
      );
    }
  });

  it("should fail if required fields are missing", async () => {
    const metric = new Metric({});

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await metric.save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    expect(err).toBeDefined();
    expect(err?.errors.ticker).toBeDefined();
    expect(err?.errors.fiscalYear).toBeDefined();
    expect(err?.errors.ticker_year).toBeDefined();
    expect(err?.errors.avgStockPrice).toBeDefined();
  });

  it("should fail if fiscalYear format is invalid", async () => {
    const badFiscalYear = {
      ...validData,
      fiscalYear: "2024-12-31", // invalid format
    };

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await new Metric(badFiscalYear).save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    expect(err).toBeDefined();
    expect(err?.errors.fiscalYear).toBeDefined();
  });

  it("should enforce unique constraint on ticker_year", async () => {
    await new Metric(validData).save();

    let err: mongoose.Error | null = null;
    try {
      await new Metric(validData).save();
    } catch (error) {
      err = error as mongoose.Error;
    }

    expect(err).toBeDefined();
    expect(err?.message).toMatch(/duplicate key/);
  });
});
