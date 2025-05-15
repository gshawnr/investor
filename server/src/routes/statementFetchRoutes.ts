import express from "express";
import statementFetchController from "../controllers/statementFetchController";

const router = express.Router();

router.get("/:balance-sheet", statementFetchController.balanceSheetFetch);
router.get("/:income", statementFetchController.incomeFetch);
// router.get("/:cashflow", statementFetchController.cashFlowStatementFetch);
// reouter.get("/:company-profile", statementFetchController.companyProfileFetch);
// router.get("/", statementFetchController.allStatementsFetch);

// INCOME STATEMENT

// CASH FLOW STATEMENT

export default router;
