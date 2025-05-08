import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (err) {
    console.log(`db.ts error: ${(err as Error).message}`);
    process.exit(1);
  }
};
export default connectDB;
