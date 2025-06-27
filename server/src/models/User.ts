import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types/IUser";
import {
  passwordValidator,
  passwordValidatorMessage,
} from "../validators/modelValidators";

interface IUserModel extends IUser, Document {
  password: string; // virtual
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.virtual("password").set(function (this: any, password: string) {
  this._rawPassword = password;

  if (!passwordValidator(password)) {
    this.invalidate("password", passwordValidatorMessage);
  }
});

userSchema.pre("validate", function (next) {
  const user = this as any;
  if (!user.passwordHash && !user._rawPassword) {
    this.invalidate("password", "Password is required.");
  }
  next();
});

userSchema.pre<IUser>("save", async function (next) {
  const user: any = this;

  if (user._rawPassword) {
    user.passwordHash = await bcrypt.hash(user._rawPassword, 10);
  }

  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Check if model exists; else create
const User: Model<IUserModel> =
  mongoose.models.User || mongoose.model<IUserModel>("User", userSchema);

export default User;
