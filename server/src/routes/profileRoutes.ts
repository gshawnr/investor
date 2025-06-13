import express from "express";
import profileController from "../controllers/profileController";
import { parseQuery } from "../middleware/queryParser";
import { IProfile } from "../types/IProfile";

const router = express.Router();
const parseProfileQuery = parseQuery<IProfile>;

// POST
router.post("/", profileController.createProfile);

// GET
router.get(
  "/paginated",
  parseProfileQuery,
  profileController.getPaginatedProfiles
);
router.get("/:ticker", profileController.getProfile);
router.get("/", profileController.getAllProfiles);

// PATCH
router.put("/:ticker", profileController.updateProfile);

// DELETE
router.delete("/:ticker", profileController.deleteProfile);

export default router;
