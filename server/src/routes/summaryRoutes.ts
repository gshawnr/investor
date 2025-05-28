import summaryController from "../controllers/summaryController";
import { Router } from "express";

const router = Router();

// POST
router.post("/", summaryController.createSummary);

export default router;
