import { Request, Response, NextFunction } from "express";
import UserService from "../services/UserService";
import ProfileService from "../services/ProfileService";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }
    const user = await UserService.createUser({ email, password });
    res.status(201).json({ email: user.email, favorites: user.favorites });
  } catch (err) {
    next(err);
  }
};

const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }
    const user = await UserService.getUserByEmail(email);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.status(200).json({ email: user.email, favorites: user.favorites });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    let { password, favorites } = req.body;

    const update: { password?: string; favorites?: string[] } = { password };

    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    if (!password && !favorites) {
      res
        .status(400)
        .json({ message: "At least one field is required to update." });
      return;
    }

    // Validate favorites if provided
    if (favorites) {
      if (!Array.isArray(favorites)) {
        res.status(400).json({ message: "Favorites must be an array." });
        return;
      }

      let validFavorites: string[] = [];
      for (const x of favorites) {
        if (typeof x !== "string") continue;

        const profile = await ProfileService.getProfileByTicker(
          x.toLowerCase()
        );

        if (profile) {
          validFavorites.push(profile.ticker);
        }
      }

      update.favorites = validFavorites;
    }

    const updated = await UserService.updateUser(email, update);

    if (!updated) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res
      .status(200)
      .json({ email: updated.email, favorites: updated.favorites });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }
    const deleted = await UserService.deleteUser(email);
    if (!deleted) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default {
  createUser,
  getUserByEmail,
  updateUser,
  deleteUser,
};
