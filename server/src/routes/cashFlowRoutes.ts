import express from "express";
import cashflowController from "../controllers/cashflowController";

const router = express.Router();

// POST
router.post("/", cashflowController.createCashflow);

// GET
router.get("/:ticker", cashflowController.getCashflow);

// UPDATE
router.put("/:ticker/:year", cashflowController.updateCashflow);

// DELETE
router.delete("/:ticker/:year", cashflowController.deleteCashflow);

export default router;
