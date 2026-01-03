import { Leave, User } from "../models/index.js";

export const applyLeave = async (req, res) => {
  try {
    const leave = await Leave.create({
      userId: req.user.id,
      ...req.body,
    });
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'employeeId']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave request not found" });

    leave.status = req.body.status;
    leave.adminComment = req.body.comment;
    await leave.save();
    res.json({ message: "Updated", leave });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
