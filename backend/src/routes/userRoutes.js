import express from "express";
import { getProfile, updateProfile, getAllUsers, getUserById } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/", protect, isAdmin, getAllUsers);
router.get("/:id", protect, isAdmin, getUserById);

export default router;
