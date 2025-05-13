import express from "express";
import cashflowController from "../controllers/cashflowController";

const router = express.Router();

// POST
router.post("/", cashflowController.createCashFlow);

// GET
router.get("/:ticker", cashflowController.getCashFlow);

// UPDATE
router.put("/:ticker/:year", cashflowController.updateCashFlow);

// DELETE
router.delete("/:ticker/:year", cashflowController.deleteCashFlow);

export default router;
