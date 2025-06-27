import express from "express";
import userController from "../controllers/userController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

// PUBLIC ROUTES
router.post("/", userController.createUser);
router.post("/login", userController.login);

// PROTECTED ROUTES
router.use(authenticateJWT);
router.get("/:email", userController.getUserByEmail);

router.patch("/:email", userController.updateUser);

router.delete("/:email", userController.deleteUser);

export default router;
