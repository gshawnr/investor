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
import metricRoutes from "../routes/metricRoutes";
import tickerYearRoutes from "../routes/tickerYearRoutes";
import targetRoutes from "../routes/targetRoutes";
import favoriteRoutes from "../routes/favoriteRoutes";
import userRoutes from "../routes/userRoutes";
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
app.use("/api/metrics", metricRoutes);
app.use("/api/targets", targetRoutes);
app.use("/api/combined", tickerYearRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handling
app.use(errorHandler);

export default app;
