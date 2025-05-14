import { Document } from "mongoose";

export interface ICalculationContants {
  year: string;
  riskFreeRate: number;
  equityRiskPremium: number;
  costOfDebt: number;
  taxRate: number;
  createdAt?: Date;
  updatedAt?: Date;
}
