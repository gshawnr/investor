import { Router } from "express";
import favoriteController from "../controllers/favoritesController";
import { parseQuery } from "../middleware/queryParser";
import { IFavorite } from "../types/IFavorite";

const router = Router();
const parseTargetQuery = parseQuery<IFavorite>;

// GET
router.get("/:userId", parseTargetQuery, favoriteController.getFavorites);

// POST
router.post("/", favoriteController.createFavorites);

// PATCH
router.patch("/:ticker_user", favoriteController.updateFavorites);

// DELETE
router.delete("/:ticker_user", favoriteController.deleteFavorites);

export default router;
