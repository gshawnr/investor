import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Summary from "../../../models/Summary";
import { ISummary } from "../../../types/ISummary";

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
  await Summary.deleteMany({});
});

describe("Summary Model", () => {
  const validData: any = {
    ticker: "AAPL",
    fiscalYear: "2024-12-31",
    ticker_year: "aapl_2024",
    beta: 1.2,
    industry: "Technology",
    sector: "Information Technology",
    assets: 1000000,
    currency: "USD",
    currentAssets: 500000,
    currentLiabilities: 200000,
    equity: 800000,
    liabilities: 200000,
    longTermDebt: 50000,
    totalDebt: 100000,
    avgSharesOutstanding: 5000,
    avgSharesOutstandingDiluted: 5100,
    costOfRevenue: 400000,
    depreciationAndAmortization: 30000,
    ebitda: 150000,
    eps: 5,
    epsDiluted: 4.8,
    grossProfit: 600000,
    netIncome: 100000,
    operatingExpenses: 200000,
    operatingIncome: 250000,
    revenue: 1000000,
    capEx: 50000,
    cashflowFromOps: 150000,
  };

  it("should save a valid summary document", async () => {
    const summary = new Summary(validData);
    const saved = await summary.save();

    expect(saved._id).toBeDefined();
    expect(saved.ticker).toBe("aapl");
    expect(saved.fiscalYear).toBe(validData.fiscalYear);
    expect(saved.ticker_year).toBe(validData.ticker_year);
    expect(saved.revenue).toBe(validData.revenue);

    // Check timestamps
    const castDoc = saved as ISummary;
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
    const summary = new Summary({});

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await summary.save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    expect(err).toBeDefined();
    expect(err?.errors.ticker).toBeDefined();
    expect(err?.errors.fiscalYear).toBeDefined();
    expect(err?.errors.ticker_year).toBeDefined();
    expect(err?.errors.revenue).toBeDefined();
  });

  it("should fail if fiscalYear format is invalid", async () => {
    const badFiscalYear = {
      ...validData,
      fiscalYear: "2024", // invalid format
    };

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await new Summary(badFiscalYear).save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    expect(err).toBeDefined();
    expect(err?.errors.fiscalYear).toBeDefined();
  });

  it("should enforce unique constraint on ticker_year", async () => {
    await new Summary(validData).save();

    let err: mongoose.Error | null = null;
    try {
      await new Summary(validData).save();
    } catch (error) {
      err = error as mongoose.Error;
    }

    expect(err).toBeDefined();
    expect(err?.message).toMatch(/duplicate key/);
  });
});
