import CalculationContants from "../models/CalculationConstants";
import { ICalculationContants } from "../types/ICalculationConstants";

class CalculationConstantsService {
  async createCalculationConstants(data: Partial<ICalculationContants>) {
    const { year, riskFreeRate, equityRiskPremium, costOfDebt, taxRate } = data;

    const numericFields = {
      riskFreeRate,
      equityRiskPremium,
      costOfDebt,
      taxRate,
    };

    const parsedFields: Record<string, number> = {};

    for (const [key, value] of Object.entries(numericFields)) {
      const parsed = typeof value === "string" ? parseFloat(value) : value;

      if (typeof parsed !== "number" || isNaN(parsed)) {
        throw new Error(`${key} must be a valid number or numeric string`);
      }

      parsedFields[key] = parsed;
    }

    const existing = await CalculationContants.findOne({ year });
    if (existing) {
      throw new Error(`calculation constant for ${year} already exists`);
    }

    const newConstants = new CalculationContants({
      year,
      riskFreeRate: parsedFields.riskFreeRate,
      equityRiskPremium: parsedFields.equityRiskPremium,
      costOfDebt: parsedFields.costOfDebt,
      taxRate: parsedFields.taxRate,
    });

    return newConstants.save();
  }

  async getAllCalculationConstants() {
    return CalculationContants.find({});
  }

  async getCalculationConstants(year: string) {
    return CalculationContants.findOne({ year });
  }

  async updateCalculationConstants(
    year: string,
    updates: Partial<ICalculationContants>
  ) {
    const numericKeys: (keyof ICalculationContants)[] = [
      "riskFreeRate",
      "equityRiskPremium",
      "costOfDebt",
      "taxRate",
    ];

    const parsedUpdates: Partial<ICalculationContants> = {};

    for (const key of numericKeys) {
      const value = updates[key];
      if (value !== undefined) {
        const parsed = typeof value === "string" ? parseFloat(value) : value;

        if (typeof parsed !== "number" || isNaN(parsed)) {
          throw new Error(`${key} must be a valid number or numeric string`);
        }

        (parsedUpdates as Record<string, number>)[key] = parsed;
      }
    }

    return CalculationContants.findOneAndUpdate(
      { year },
      { $set: parsedUpdates },
      { new: true, runValidators: true }
    );
  }

  async deleteCalculationConstants(year: string) {
    return CalculationContants.findOneAndDelete({ year });
  }
}

export default new CalculationConstantsService();
