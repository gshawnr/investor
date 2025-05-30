import metricController from "../controllers/metricController";
import { IMetric } from "../types/IMetric";
import { parseQuery } from "../middleware/queryParser";
import { Router } from "express";

const router = Router();
const parseMetricQuery = parseQuery<IMetric>;

// GET
router.get("/", parseMetricQuery, metricController.getMetrics);

// POST
router.post("/", metricController.createMetric);

export default router;
