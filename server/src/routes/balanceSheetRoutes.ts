import express from "express";
import BalanceSheetController from "../controllers/balanceSheetController";

const router = express.Router();

// POST
router.post("/", BalanceSheetController.createBalanceSheet);

// GET
router.get("/:ticker", BalanceSheetController.getBalanceSheet);

// UPDATE
router.put("/:ticker/:year", BalanceSheetController.updateBalanceSheet);

// DELETE
router.delete("/:ticker/:year", BalanceSheetController.deleteBalanceSheet);

export default router;
