const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // ✅
const { getUserGroups } = require("../controllers/groupController");
const Group = require("../models/Group");
const User = require("../models/User");

// Create group
router.post("/create", authMiddleware, async (req, res) => {
  const { name } = req.body;
  const userId = req.userId;
  try {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const group = await Group.create({ name, code, members: [userId] });
    await User.findByIdAndUpdate(userId, { $push: { groups: group._id } });
    res.json({ group });
  } catch (err) {
    res.status(500).json({ message: "Failed to create group" });
  }
});

// Join group
router.post("/join", authMiddleware, async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;
  try {
    const group = await Group.findOne({ code });
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
      await User.findByIdAndUpdate(userId, { $push: { groups: group._id } });
    }

    res.json({ group });
  } catch (err) {
    res.status(500).json({ message: "Failed to join group" });
  }
});

// Get user groups
router.get("/user", authMiddleware, getUserGroups);

module.exports = router;
