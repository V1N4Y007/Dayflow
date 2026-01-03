import express from "express";
import { checkIn, checkOut, getMyAttendance, getAllAttendance } from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.post("/checkin", protect, checkIn);
router.put("/checkout", protect, checkOut);
router.get("/me", protect, getMyAttendance);
router.get("/", protect, isAdmin, getAllAttendance);

export default router;
