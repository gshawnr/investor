import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

// CREATE
router.post("/", userController.createUser);

// READ
router.get("/:email", userController.getUserByEmail);

// UPDATE
router.patch("/:email", userController.updateUser);

// DELETE
router.delete("/:email", userController.deleteUser);

export default router;
