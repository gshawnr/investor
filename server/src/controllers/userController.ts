import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserService from "../services/UserService";

const JWT_SECRET = process.env.JWT_SECRET || "";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }
    const user = await UserService.createUser({ email, password });
    res.status(201).json({ email: user.email, userId: user._id });
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
    res.status(200).json({ email: user.email, userId: user._id });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    let { password } = req.body;

    const update: { password?: string } = { password };

    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    if (!password) {
      res
        .status(400)
        .json({ message: "At least one field is required to update." });
      return;
    }

    const updated = await UserService.updateUser(email, update);

    if (!updated) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json({ email: updated.email });
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

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const isMatch = await UserService.comparePassword(email, password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, userId: user._id });
    return;
  } catch (err) {
    next(err);
  }
};

export default {
  createUser,
  getUserByEmail,
  updateUser,
  deleteUser,
  login,
};
