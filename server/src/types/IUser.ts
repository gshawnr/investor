import mongoose from "mongoose";

// You can adjust this or import from your types
export interface IUser extends mongoose.Document {
  email: string;
  passwordHash: string;
  favorites: string[];
  comparePassword(candidate: string): Promise<boolean>;
}
