import { Payroll, User } from "../models/index.js";

export const getMyPayroll = async (req, res) => {
  try {
    const data = await Payroll.findAll({
      where: { userId: req.user.id },
      order: [['month', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createPayroll = async (req, res) => {
  try {
    const { userId, month, basicSalary, deductions } = req.body;

    const salary = parseFloat(basicSalary);
    const deduct = parseFloat(deductions);
    const netSalary = salary - deduct;

    const payroll = await Payroll.create({
      userId,
      month,
      basicSalary: salary,
      deductions: deduct,
      netSalary
    });
    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllPayrolls = async (req, res) => {
  try {
    const data = await Payroll.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'employeeId']
      }],
      order: [['month', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
