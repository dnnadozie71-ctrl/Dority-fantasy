// backend/controllers/transferController.js
const User = require("../models/User");
const Player = require("../models/Player");
const Team = require("../models/Team");
const Group = require("../models/Group");

// ================== TEAMS ==================
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("players");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Error fetching teams", error: err.message });
  }
};

exports.getTeamByName = async (req, res) => {
  try {
    const team = await Team.findOne({ name: req.params.name }).populate("players");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: "Error fetching team", error: err.message });
  }
};

// ================== PLAYERS ==================
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: "Error fetching players", error: err.message });
  }
};

// ✅ EDITED: Handle the case where the squad is empty
exports.getMySquad = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("squad");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Send an empty array if the squad doesn't exist or is empty
    const squad = user.squad || [];
    res.json(squad);
  } catch (err) {
    res.status(500).json({ message: "Error fetching squad", error: err.message });
  }
};

// ================== BUY / SELL ==================
exports.buyPlayer = async (req, res) => {
  res.status(200).json({ message: "buyPlayer stub - implement logic later" });
};

exports.sellPlayer = async (req, res) => {
  res.status(200).json({ message: "sellPlayer stub - implement logic later" });
};

// ================== LINEUP / FORMATION ==================
exports.setStartingXI = async (req, res) => {
  res.status(200).json({ message: "setStartingXI stub - implement logic later" });
};

exports.changeFormation = async (req, res) => {
  res.status(200).json({ message: "changeFormation stub - implement logic later" });
};

// ================== FANTASY TEAM ==================
// ✅ EDITED: Handle the case where the user's team/squad is empty
exports.getMyTeam = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("squad")
      .populate("startingXI");
    
    if (!user) return res.status(404).json({ message: "User not found" });

    // Send a 200 OK response with an empty team and a default name if the squad is empty
    const team = {
      team: user.squad || [],
      teamName: user.teamName || "Your Team",
    };

    res.json(team);

  } catch (err) {
    res.status(500).json({ message: "Error fetching team", error: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("squad")
      .populate("startingXI");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      teamName: user.teamName,
      budget: user.budget,
      points: user.points,
      squadSize: user.squad.length,
      startingXI: user.startingXI.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard", error: err.message });
  }
};

exports.setTeamName = async (req, res) => {
  try {
    const { teamName } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { teamName },
      { new: true }
    );
    res.json({ message: "Team name updated", teamName: user.teamName });
  } catch (err) {
    res.status(500).json({ message: "Error setting team name", error: err.message });
  }
};

// ================== GROUPS ==================
exports.createGroup = async (req, res) => {
  res.status(200).json({ message: "createGroup stub - implement logic later" });
};

exports.joinGroup = async (req, res) => {
  res.status(200).json({ message: "joinGroup stub - implement logic later" });
};

exports.leaveGroup = async (req, res) => {
  res.status(200).json({ message: "leaveGroup stub - implement logic later" });
};

exports.getUserGroups = async (req, res) => {
  res.status(200).json({ message: "getUserGroups stub - implement logic later" });
};