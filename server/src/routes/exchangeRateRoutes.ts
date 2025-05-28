import express from "express";
import exchangeRateController from "../controllers/exchangeRateController";

const router = express.Router();

// POST
router.post("/", exchangeRateController.createExchangeRate);

// GET
router.get("/", exchangeRateController.getExchangeRates);

// UPDATE
router.patch("/:currency/:year", exchangeRateController.updateExchangeRate);

// DELETE
router.delete("/:currency/:year", exchangeRateController.deleteExchangeRate);

export default router;
