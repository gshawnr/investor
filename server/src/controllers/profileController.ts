import { Request, Response, NextFunction } from "express";
import ProfileService from "../services/ProfileService";
import { IProfile } from "../types/IProfile";
import { RequestWithPagination } from "../middleware/queryParser";

const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await ProfileService.createProfile(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticker } = req.params;
    const result = await ProfileService.getProfileByTicker(ticker);

    if (!result) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getAllProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await ProfileService.getProfiles();
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

const getPaginatedProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pagination } = req as RequestWithPagination<IProfile>;
    const { filter, options } = pagination || {};

    const [profiles, totalCount] = await Promise.all([
      ProfileService.getProfiles(filter, options),
      ProfileService.getProfilesCount(filter),
    ]);

    res.status(200).json({ profiles, totalCount });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker } = req.params;
    const updates = { ...req.body };
    if (updates._id) {
      delete updates._id;
    }

    const result = await ProfileService.updateProfile(ticker, updates);
    if (!result) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticker } = req.params;
    const result = await ProfileService.deleteProfile(ticker);

    if (!result) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default {
  createProfile,
  getProfile,
  getAllProfiles,
  getPaginatedProfiles,
  updateProfile,
  deleteProfile,
};
