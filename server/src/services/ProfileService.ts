import Profile from "../models/Profile";
import { IProfile } from "../types/IProfile";

class ProfileService {
  async createProfile(transformedProfile: Partial<IProfile>) {
    const { ticker, companyName, exchange, sector, industry, beta, raw } =
      transformedProfile;

    if (!ticker) {
      throw new Error("Ticker is required to create a profile.");
    }

    const existing = await Profile.findOne({ ticker: ticker.toLowerCase() });
    if (existing) {
      throw new Error(`Profile for ticker "${ticker}" already exists.`);
    }

    const profile = new Profile({
      ticker,
      companyName,
      exchange,
      beta,
      industry,
      sector,
      raw,
    });

    return profile.save();
  }

  async getProfiles() {
    return Profile.find({});
  }

  async getProfileByTicker(ticker: string) {
    return Profile.findOne({ ticker: ticker.toLowerCase() });
  }

  async updateProfile(ticker: string, updates: Partial<IProfile>) {
    return Profile.findOneAndUpdate(
      { ticker: ticker.toLowerCase() },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async deleteProfile(ticker: string) {
    return Profile.findOneAndDelete({ ticker: ticker.toLowerCase() });
  }
}

export default new ProfileService();
