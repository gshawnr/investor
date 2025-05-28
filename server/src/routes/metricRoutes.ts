import metricController from "../controllers/metricController";
import { Router } from "express";

const router = Router();

// POST
router.post("/", metricController.createMetric);

export default router;
