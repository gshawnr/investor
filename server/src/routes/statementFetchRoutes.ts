import express from "express";
import statementFetchController from "../controllers/statementFetchController";

const router = express.Router();

router.get("/balance-sheet", statementFetchController.balanceSheetFetch);
router.get("/income", statementFetchController.incomeFetch);
router.get("/price", statementFetchController.priceFetchByTicker);
router.get("/price/update", statementFetchController.updatePriceByTicker);
router.get("/cashflow", statementFetchController.cashflowFetch);
router.get("/all", statementFetchController.allStatementsFetch);
// router.get("/company-profile", statementFetchController.companyProfileFetch); TODO

export default router;
