import { Document } from "mongoose";

export interface IProfile extends Document {
  ticker: string;
  companyName: string;
  exchange: string;
  beta: number;
  industry: string;
  sector: string;
  raw: object;
  createdAt: Date;
  updatedAt: Date;
}
