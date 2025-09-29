// backend/routes/users.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");

// Helper: Create JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ===== GET ALL USERS =====
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

// ===== GET SINGLE USER =====
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

// ===== UPDATE USER (teamName, budget) =====
router.put("/:id", async (req, res) => {
  try {
    const { teamName, budget } = req.body;
    const updateFields = {};
    if (teamName !== undefined) updateFields.teamName = teamName;
    if (budget !== undefined) updateFields.budget = budget;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
});

// ===== REGISTER =====
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      budget: 100,
      squad: [],
      startingXI: [],
    });

    await newUser.save();
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        budget: newUser.budget,
        teamName: newUser.teamName,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to register user", error: err.message });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        budget: user.budget,
        teamName: user.teamName,
        squad: user.squad,
        startingXI: user.startingXI,
      },
      token,
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
