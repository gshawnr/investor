import tickerYearController from "../controllers/tickerYearController";
import { IMetric } from "../types/IMetric";
import { ITickerYear } from "../types/ITickerYear";
import { parseQuery } from "../middleware/queryParser";
import { Router } from "express";

const router = Router();
const parseMetricQuery = parseQuery<ITickerYear>;

// GET
router.get("/", parseMetricQuery, tickerYearController.getTickerYearsAndData);

export default router;
