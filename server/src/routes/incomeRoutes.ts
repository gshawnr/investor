import express from "express";
import incomeController from "../controllers/incomeController";

const router = express.Router();

// POST
router.post("/", incomeController.createIncome);

// GET
router.get("/:ticker", incomeController.getIncome);

// UPDATE
router.put("/:ticker/:year", incomeController.updateIncome);

// DELETE
router.delete("/:ticker/:year", incomeController.deleteIncome);

export default router;
