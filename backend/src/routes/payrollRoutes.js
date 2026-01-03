import express from "express";
import { getMyPayroll, createPayroll, getAllPayrolls, deletePayroll } from "../controllers/payrollController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.get("/me", protect, getMyPayroll);
router.post("/create", protect, isAdmin, createPayroll);
router.get("/", protect, isAdmin, getAllPayrolls);
router.delete("/:id", protect, isAdmin, deletePayroll);

export default router;
