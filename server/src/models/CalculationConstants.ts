import mongoose, { Schema } from "mongoose";
import { ICalculationContants } from "../types/ICalculationConstants";

const calculationConstantsSchema = new Schema(
  {
    year: { type: String, required: true, unique: true },
    riskFreeRate: { type: Number, required: true },
    equityRiskPremium: { type: Number, required: true },
    costOfDebt: { type: Number, required: true },
    taxRate: { type: Number, required: true },
  },
  { timestamps: true }
);

const CalculationContants = mongoose.model<ICalculationContants>(
  "CalculationConstants",
  calculationConstantsSchema
);

export default CalculationContants;
