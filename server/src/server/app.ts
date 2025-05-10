import express from "express";
import cors from "cors";
import balanceSheetRoutes from "../routes/balanceSheetRoutes";
import cashflowRoutes from "../routes/cashFlowRoutes";
import { errorHandler } from "../middleware/errorHandler";
import { AppError } from "../utils/AppError";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use("/api/balance-sheets", balanceSheetRoutes);
app.use("/api/cashflows", cashflowRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handling
app.use(errorHandler);

export default app;
