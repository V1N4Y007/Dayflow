import User from "../models/User.js";

// Get logged in user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ["password"] },
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update logged in user profile
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Allow updating only specific fields for now
        const { name, phone, address, profileImage } = req.body;

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.json({ message: "Profile updated", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin: Get specific user
export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin: Update any user
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, email, role, phone, address, salary, employeeId, documents } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (salary) user.salary = salary;
        if (employeeId) user.employeeId = employeeId;
        if (documents) user.documents = documents;

        await user.save();

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
