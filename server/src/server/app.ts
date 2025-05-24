import express from "express";
import cors from "cors";
import balanceSheetRoutes from "../routes/balanceSheetRoutes";
import cashflowRoutes from "../routes/cashflowRoutes";
import profileRoutes from "../routes/profileRoutes";
import incomeRoutes from "../routes/incomeRoutes";
import calculationConstantsRoutes from "../routes/calculationContantsRoutes";
import exchangeRateRoutes from "../routes/exchangeRateRoutes";
import statementFetchRoutes from "../routes/statementFetchRoutes";
import summaryRoutes from "../routes/summaryRoutes";
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
app.use("/api/profiles", profileRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/calculation-constants", calculationConstantsRoutes);
app.use("/api/exchange-rate", exchangeRateRoutes);
app.use("/api/fetch", statementFetchRoutes);
app.use("/api/summaries", summaryRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handling
app.use(errorHandler);

export default app;
