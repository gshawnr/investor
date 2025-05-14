import express from "express";
import calculationContantsController from "../controllers/calculationConstantsController";

const router = express.Router();

// POST
router.post("/", calculationContantsController.createCalculationConstants);

// GET
router.get("/:year", calculationContantsController.getCalculationConstants);
router.get("/", calculationContantsController.getCalculationConstants);

// UPDATE
router.patch(
  "/:year",
  calculationContantsController.updateCalculationConstants
);

// DELETE
router.delete(
  "/:year",
  calculationContantsController.deleteCalculationConstants
);

export default router;
