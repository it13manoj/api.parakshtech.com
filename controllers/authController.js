const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const { generateToken } = require("../utils/jwt.js");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    const user = await User.create({
      name: name || "Admin",
      email: email || "admin@example.com",
      password: password || "Admin@123",
      role: role || "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("User creation failed:", err);
    res.status(500).json({ success: false, message: "Failed to create user", error: err.message });
  }
};

exports.seedDefaultAdmin = async (req, res) => {
  try {
    let admin = await User.findOne({ where: { role: "admin" } });
    if (!admin) {
      admin = await User.create({
        name: "ParakshTech Admin",
        email: "admin@parakshtech.com",
        password: "Admin@123",
        role: "admin",
      });
      return res.json({ success: true, message: "Default admin seeded", email: admin.email });
    }
    res.json({ success: true, message: "Admin user already exists", email: admin.email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update authenticated admin's password
 */
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are both required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password does not match our records",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully! Please use your new password for your next login.",
    });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: err.message,
    });
  }
};

/**
 * Update authenticated admin profile details (name, email)
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing && existing.id !== userId) {
        return res.status(400).json({
          success: false,
          message: "Email address is already in use by another account",
        });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile details updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
};