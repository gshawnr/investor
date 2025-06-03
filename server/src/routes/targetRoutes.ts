import { Router } from "express";
import targetController from "../controllers/TargetController";
import { ITarget } from "../types/ITarget";
import { parseQuery } from "../middleware/queryParser";

const router = Router();
const parseTargetQuery = parseQuery<ITarget>;

// GET
router.get("/", parseTargetQuery, targetController.getTargets);

// POST
router.post("/", targetController.createTargets);

export default router;
