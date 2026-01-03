import express from "express";
import { getMyPayroll, createPayroll, getAllPayrolls } from "../controllers/payrollController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.get("/me", protect, getMyPayroll);
router.post("/create", protect, isAdmin, createPayroll);
router.get("/", protect, isAdmin, getAllPayrolls);

export default router;
