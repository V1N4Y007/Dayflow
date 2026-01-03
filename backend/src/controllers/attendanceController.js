import { Attendance, User } from "../models/index.js";
import { Op } from "sequelize";

export const checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in
    const existing = await Attendance.findOne({
      where: {
        userId: req.user.id,
        date: today
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const attendance = await Attendance.create({
      userId: req.user.id,
      date: today,
      checkIn: new Date(),
      status: "PRESENT",
    });
    res.json({ message: "Checked in", attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({
      where: {
        userId: req.user.id,
        date: today
      }
    });

    if (!attendance) {
      return res.status(404).json({ message: "No attendance record found for today" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out" });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.json({ message: "Checked out", attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const data = await Attendance.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'employeeId']
      }],
      order: [['date', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
