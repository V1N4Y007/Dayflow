import express from "express";
import { applyLeave, approveLeave, getMyLeaves, getAllLeaves } from "../controllers/leaveController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.post("/apply", protect, applyLeave);
router.get("/me", protect, getMyLeaves);
router.get("/", protect, isAdmin, getAllLeaves);
router.put("/:id/approve", protect, isAdmin, approveLeave);
export default router;
