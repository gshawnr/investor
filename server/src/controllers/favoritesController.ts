import { Request, Response, NextFunction } from "express";
import FavoriteService from "../services/FavoriteService";
import { IFavorite, CreateFavoriteInputType } from "../types/IFavorite";
import { RequestWithPagination } from "../middleware/queryParser";
import { Types } from "mongoose";
import UserService from "../services/UserService";
import Profile from "../models/Profile";
import ProfileService from "../services/ProfileService";

export const createFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker, targetPurchasePriceUSD, targetSalesPriceUSD, userId } =
      req.body;

    if (!ticker || !targetPurchasePriceUSD || !targetSalesPriceUSD || !userId) {
      res.status(400).json({ message: "All fields are required" });
    }

    const formatedTicker = ticker.toLowerCase().trim();
    const profile = await ProfileService.getProfileByTicker(formatedTicker);

    if (!profile) {
      res.status(400).json({ message: "Security not found for the ticker" });
      return;
    }

    const { industry, sector } = profile;

    const ticker_user = `${formatedTicker}_${userId}`;
    const favoriteData: CreateFavoriteInputType = {
      ticker: formatedTicker,
      ticker_user,
      industry,
      sector,
      targetPurchasePriceUSD,
      targetSalesPriceUSD,
      userId,
    };

    const favorite = await FavoriteService.createFavorites(favoriteData);
    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
};

export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pagination, params } = req as RequestWithPagination<IFavorite>;
    const { userId } = params;
    const { filter = {}, options } = pagination || {};

    const user = await UserService.getUserById(userId);
    if (!user) {
      res.status(400).json({ message: "user not found" });
      return;
    }

    filter.userId = user._id;
    const favorites = await FavoriteService.getFavorites({ filter, options });
    res.status(200).json(favorites);
  } catch (err) {
    next(err);
  }
};

export const updateFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { industry, sector, targetPurchasePriceUSD, targetSalesPriceUSD } =
      req.body;

    const { ticker_user } = req.params;

    const update: any = {};
    if (industry) update.industry = industry;
    if (sector) update.sector = sector;
    if (targetPurchasePriceUSD)
      update.targetPurchasePriceUSD = targetPurchasePriceUSD;
    if (targetSalesPriceUSD) update.targetSalesPriceUSD = targetSalesPriceUSD;

    if (Object.keys(update).length === 0) {
      res.status(400).json({ message: "No fields to update" });
      return;
    }

    const favorite = await FavoriteService.updateFavorites(ticker_user, update);
    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
};

export const deleteFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker_user } = req.params;

    const regex = /^[A-Z]{1,5}_[a-f\d]{24}$/i;
    if (!regex.test(ticker_user as string)) {
      res.status(400).json({ message: "invalid ticker_user provided" });
      return;
    }

    await FavoriteService.deleteFavorites(ticker_user);
    res.status(204).json({ message: "success" });
  } catch (err) {
    next(err);
  }
};

export default {
  createFavorites,
  getFavorites,
  updateFavorites,
  deleteFavorites,
};
