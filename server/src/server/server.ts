import dotenv from "dotenv";
import connectDB from "../config/db";

dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
  } catch (err) {
    console.log(`server error: ${(err as Error).message}`);
  }
};

startServer();
