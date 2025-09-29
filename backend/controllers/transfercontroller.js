const User = require("../models/User");
const Player = require("../models/Player");
const Team = require("../models/Team");
const Group = require("../models/Group"); // Make sure you have this model

// ===== TEAMS =====

// Get all real teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("players");
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get a specific real team by name
exports.getTeamByName = async (req, res) => {
  try {
    const team = await Team.findOne({ name: req.params.name }).populate("players");
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===== PLAYERS =====

// Get all players in the market
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===== USER SQUAD =====

// Get user's squad
exports.getMySquad = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Fetching squad for user ID:", userId);
    
    const user = await User.findById(userId).populate("squad");
    
    if (!user) {
      console.log("User not found in database:", userId);
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    res.json({
      squad: user.squad || [],
      budget: user.budget || 100
    });
  } catch (error) {
    console.error("Error in getMySquad:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's fantasy team (full info)
exports.getMyTeam = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Fetching team for user ID:", userId);
    
    const user = await User.findById(userId).populate("squad");
    
    if (!user) {
      console.log("User not found in database:", userId);
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    console.log("User found:", user.username);
    
    res.json({
      squad: user.squad || [],
      budget: user.budget || 100,
      teamName: user.teamName || "My Team",
      startingXI: user.startingXI || [],
      formation: user.formation || "4-4-2"
    });
  } catch (error) {
    console.error("Error in getMyTeam:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Fetching dashboard for user ID:", userId);
    
    const user = await User.findById(userId).populate("squad");
    
    if (!user) {
      console.log("User not found in database:", userId);
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    const totalPlayers = user.squad ? user.squad.length : 0;
    const startingXICount = user.startingXI ? user.startingXI.length : 0;
    
    res.json({
      username: user.username,
      teamName: user.teamName || "My Team",
      budget: user.budget || 100,
      squad: user.squad || [],
      startingXI: user.startingXI || [],
      formation: user.formation || "4-4-2",
      totalPlayers,
      startingXICount,
      points: user.points || 0
    });
  } catch (error) {
    console.error("Error in getDashboard:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===== BUY/SELL PLAYERS =====

// Buy player
exports.buyPlayer = async (req, res) => {
  try {
    const userId = req.userId;
    const { playerId } = req.params;
    
    console.log(`User ${userId} attempting to buy player ${playerId}`);
    
    const user = await User.findById(userId).populate("squad");
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    
    const alreadyOwned = user.squad.some(p => p._id.toString() === playerId);
    if (alreadyOwned) {
      return res.status(400).json({ message: "You already own this player" });
    }
    
    if (user.budget < player.marketvalue) {
      return res.status(400).json({ 
        message: `Insufficient funds. You need $${player.marketvalue}M but only have $${user.budget}M` 
      });
    }
    
    if (user.squad.length >= 15) {
      return res.status(400).json({ message: "Squad is full. Maximum 15 players allowed." });
    }
    
    user.squad.push(player._id);
    user.budget -= player.marketvalue;
    
    await user.save();
    await user.populate("squad");
    
    console.log(`Player ${player.name} bought successfully`);
    
    res.json({
      message: `Successfully bought ${player.name}`,
      squad: user.squad,
      budget: user.budget
    });
  } catch (error) {
    console.error("Error buying player:", error);
    res.status(500).json({ message: error.message });
  }
};

// Sell player
exports.sellPlayer = async (req, res) => {
  try {
    const userId = req.userId;
    const { playerId } = req.params;
    
    console.log(`User ${userId} attempting to sell player ${playerId}`);
    
    const user = await User.findById(userId).populate("squad");
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    
    const playerIndex = user.squad.findIndex(p => p._id.toString() === playerId);
    if (playerIndex === -1) {
      return res.status(400).json({ message: "You don't own this player" });
    }
    
    user.squad.splice(playerIndex, 1);
    user.budget += player.marketvalue;
    
    if (user.startingXI) {
      const startingIndex = user.startingXI.findIndex(p => p.toString() === playerId);
      if (startingIndex !== -1) {
        user.startingXI.splice(startingIndex, 1);
      }
    }
    
    await user.save();
    await user.populate("squad");
    
    console.log(`Player ${player.name} sold successfully`);
    
    res.json({
      message: `Successfully sold ${player.name}`,
      squad: user.squad,
      budget: user.budget
    });
  } catch (error) {
    console.error("Error selling player:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===== LINEUP / FORMATION =====

// Set starting XI
exports.setStartingXI = async (req, res) => {
  try {
    const userId = req.userId;
    const { startingXI } = req.body;
    
    console.log(`User ${userId} setting starting XI`);
    
    const user = await User.findById(userId).populate("squad");
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    if (!Array.isArray(startingXI)) {
      return res.status(400).json({ message: "Starting XI must be an array" });
    }
    
    if (startingXI.length !== 11) {
      return res.status(400).json({ message: "Starting XI must have exactly 11 players" });
    }
    
    const squadIds = user.squad.map(p => p._id.toString());
    const invalidPlayers = startingXI.filter(id => !squadIds.includes(id));
    
    if (invalidPlayers.length > 0) {
      return res.status(400).json({ 
        message: "Some players in starting XI are not in your squad" 
      });
    }
    
    const players = await Player.find({ _id: { $in: startingXI } });
    const positions = players.reduce((acc, player) => {
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {});
    
    const goalkeepers = positions['Goalkeeper'] || 0;
    if (goalkeepers !== 1) {
      return res.status(400).json({ 
        message: "Starting XI must have exactly 1 goalkeeper" 
      });
    }
    
    user.startingXI = startingXI;
    await user.save();
    
    console.log("Starting XI set successfully");
    
    res.json({
      message: "Starting XI set successfully",
      startingXI: user.startingXI
    });
  } catch (error) {
    console.error("Error setting starting XI:", error);
    res.status(500).json({ message: error.message });
  }
};

// Change formation
exports.changeFormation = async (req, res) => {
  try {
    const userId = req.userId;
    const { formation } = req.body;
    
    console.log(`User ${userId} changing formation to: ${formation}`);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    // Validate formation format (e.g., "4-4-2", "3-5-2", etc.)
    const validFormations = ["4-4-2", "4-3-3", "3-5-2", "4-5-1", "3-4-3", "5-3-2"];
    if (!validFormations.includes(formation)) {
      return res.status(400).json({ 
        message: "Invalid formation. Valid options: " + validFormations.join(", ")
      });
    }
    
    user.formation = formation;
    await user.save();
    
    console.log("Formation changed successfully");
    
    res.json({
      message: "Formation changed successfully",
      formation: user.formation
    });
  } catch (error) {
    console.error("Error changing formation:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===== TEAM NAME =====

// Set team name
exports.setTeamName = async (req, res) => {
  try {
    const userId = req.userId;
    const { teamName } = req.body;
    
    console.log(`User ${userId} updating team name to: ${teamName}`);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    if (!teamName || teamName.trim().length === 0) {
      return res.status(400).json({ message: "Team name cannot be empty" });
    }
    
    if (teamName.length > 30) {
      return res.status(400).json({ message: "Team name must be 30 characters or less" });
    }
    
    user.teamName = teamName.trim();
    await user.save();
    
    console.log("Team name updated successfully");
    
    res.json({
      message: "Team name updated successfully",
      teamName: user.teamName
    });
  } catch (error) {
    console.error("Error updating team name:", error);
    res.status(500).json({ message: error.message });
  }
};

// Alias for compatibility
exports.updateTeamName = exports.setTeamName;

// ===== GROUPS =====

// Create group
exports.createGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description } = req.body;
    
    console.log(`User ${userId} creating group: ${name}`);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Group name is required" });
    }
    
    // Create new group (you'll need a Group model for this)
    const group = new Group({
      name: name.trim(),
      description: description || "",
      creator: userId,
      members: [userId]
    });
    
    await group.save();
    
    res.status(201).json({
      message: "Group created successfully",
      group
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: error.message });
  }
};

// Join group
exports.joinGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const { groupId } = req.body;
    
    console.log(`User ${userId} joining group: ${groupId}`);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member of this group" });
    }
    
    group.members.push(userId);
    await group.save();
    
    res.json({
      message: "Successfully joined group",
      group
    });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ message: error.message });
  }
};

// Leave group
exports.leaveGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const { groupId } = req.body;
    
    console.log(`User ${userId} leaving group: ${groupId}`);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    const memberIndex = group.members.indexOf(userId);
    if (memberIndex === -1) {
      return res.status(400).json({ message: "You are not a member of this group" });
    }
    
    group.members.splice(memberIndex, 1);
    await group.save();
    
    res.json({
      message: "Successfully left group",
      group
    });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's groups
exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    
    console.log(`Fetching groups for user: ${userId}`);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        shouldReLogin: true
      });
    }
    
    const groups = await Group.find({ members: userId });
    
    res.json({
      groups
    });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ message: error.message });
  }
};