import mongoose, { Schema } from "mongoose";
import { IProfile } from "../types/IProfile";

const profileSchema = new Schema(
  {
    ticker: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    companyName: { type: String, required: true },
    exchange: { type: String, required: true },
    beta: { type: Number, required: true },
    industry: { type: String, required: true },
    sector: { type: String, required: true },
    raw: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model<IProfile>("Profile", profileSchema);

export default Profile;
