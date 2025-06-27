import mongoose from "mongoose";
import User from "../../src/models/User";
import { IUser } from "../types/IUser";

class UserService {
  async createUser(data: { email: string; password: string }) {
    const { email, password } = data;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new Error(`User with email ${email} already exists.`);
    }

    const user = new User({
      email: email.toLowerCase(),
      password,
    });

    return await user.save();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async updateUser(
    email: string,
    update: { password?: string }
  ): Promise<IUser | null> {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return null;

    if (update.password) {
      // If updating password, set virtual and remove from update object
      (user as any).password = update.password;
    }

    return user.save();
  }

  async deleteUser(email: string): Promise<IUser | null> {
    return User.findOneAndDelete({ email: email.toLowerCase() });
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return false;
    return user.comparePassword(password);
  }

  async comparePassword(
    email: string,
    candidatePassword: string
  ): Promise<boolean> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.passwordHash) return false;
    return await user.comparePassword(candidatePassword);
  }
}

export default new UserService();
