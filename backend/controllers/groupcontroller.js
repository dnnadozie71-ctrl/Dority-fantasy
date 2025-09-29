const Group = require("../models/Group");

exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.userId; // set by authMiddleware
    const groups = await Group.find({ members: userId });
    res.json(groups);
  } catch (err) {
    console.error("Error fetching user groups:", err);
    res.status(500).json({ message: "Failed to fetch user groups" });
  }
};
