import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { employeeId, email, password, role, name } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      employeeId,
      name,
      email,
      password: hash,
      role: role || 'EMPLOYEE',
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.profileImage
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
