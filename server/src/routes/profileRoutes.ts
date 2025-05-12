import express from "express";
import profileController from "../controllers/profileController";

const router = express.Router();

// POST
router.post("/", profileController.createProfile);

// GET
router.get("/:ticker", profileController.getProfile);
router.get("/", profileController.getAllProfiles);

// PATCH
router.put("/:ticker", profileController.updateProfile);

// DELETE
router.delete("/:ticker", profileController.deleteProfile);

export default router;
