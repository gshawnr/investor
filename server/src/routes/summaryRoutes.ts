import summaryController from "../controllers/summaryController";
import { ISummary } from "../types/ISummary";
import { parseQuery } from "../middleware/queryParser";
import { Router } from "express";

const router = Router();
const parseSummaryQuery = parseQuery<ISummary>;

// GET
router.get("/", parseSummaryQuery, summaryController.getSummaries);

// POST
router.post("/", summaryController.createSummary);

export default router;
