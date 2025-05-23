import express from "express";
import statementFetchController from "../controllers/statementFetchController";

const router = express.Router();

router.get("/balance-sheet", statementFetchController.balanceSheetFetch);
router.get("/income", statementFetchController.incomeFetch);
router.get("/cashflow", statementFetchController.CashflowFetch);
router.get("/all", statementFetchController.allStatementsFetch);
// router.get("/company-profile", statementFetchController.companyProfileFetch); TODO

export default router;
