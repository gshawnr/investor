import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Profile from "../../../models/Profile";
import { IProfile } from "../../../types/IProfile";

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
  await Profile.deleteMany({});
});

describe("Profile Model", () => {
  it("should save a valid profile document", async () => {
    const validData = {
      ticker: "AAPL",
      companyName: "Apple Inc.",
      exchange: "NASDAQ",
      beta: 1.2,
      industry: "Consumer Electronics",
      sector: "Technology",
      raw: {
        ticker: "AAPL",
        companyName: "Apple Inc.",
        exchange: "NASDAQ",
      },
    };

    const doc = new Profile(validData);
    const savedDoc = await doc.save();

    expect(savedDoc._id).toBeDefined();
    expect(savedDoc.ticker).toBe("aapl"); // lowercase enforced
    expect(savedDoc.companyName).toBe(validData.companyName);
    expect(savedDoc.exchange).toBe(validData.exchange);
    expect(savedDoc.beta).toBe(validData.beta);
    expect(savedDoc.industry).toBe(validData.industry);
    expect(savedDoc.sector).toBe(validData.sector);
    expect(savedDoc.raw).toEqual(validData.raw);

    // Timestamps check
    const castDoc = savedDoc as IProfile;
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
    const invalidDoc = new Profile({});

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await invalidDoc.save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    expect(err).toBeDefined();
    expect(err?.errors.ticker).toBeDefined();
    expect(err?.errors.companyName).toBeDefined();
    expect(err?.errors.exchange).toBeDefined();
    expect(err?.errors.beta).toBeDefined();
    expect(err?.errors.industry).toBeDefined();
    expect(err?.errors.sector).toBeDefined();
    expect(err?.errors.raw).toBeDefined();
  });

  it("should enforce unique constraint on ticker", async () => {
    const data = {
      ticker: "GOOG",
      companyName: "Alphabet Inc.",
      exchange: "NASDAQ",
      beta: 1.1,
      industry: "Internet Content & Information",
      sector: "Communication Services",
      raw: {
        ticker: "GOOG",
        name: "Alphabet Inc.",
      },
    };

    await new Profile(data).save();

    let err: mongoose.Error | null = null;
    try {
      await new Profile(data).save();
    } catch (error) {
      err = error as mongoose.Error;
    }

    expect(err).toBeDefined();
    expect(err?.message).toMatch(/duplicate key/);
  });
});
