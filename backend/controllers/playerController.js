// backend/controllers/playerController.js
const User = require("../models/User");
const Player = require("../models/Player");

// ================= GET ALL PLAYERS =================
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch players" });
  }
};

// ================= GET MY TEAM =================
exports.getMyTeam = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("squad")
      .populate("startingXI");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      squad: user.squad,
      startingXI: user.startingXI,
      budget: user.budget,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch squad" });
  }
};

// ================= BUY PLAYER =================
exports.buyPlayer = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("squad");
    const player = await Player.findById(req.params.playerId);

    if (!user || !player)
      return res.status(404).json({ message: "User or player not found" });

    // Check if squad already has 15 players
    if (user.squad.length >= 15) {
      return res.status(400).json({ message: "Your squad is full (max 15 players)" });
    }

    // Already in squad?
    if (user.squad.some((p) => p._id.equals(player._id)))
      return res.status(400).json({ message: "Player already in your squad" });

    // Budget check
    if (user.budget < player.marketvalue)
      return res.status(400).json({ message: "Not enough budget" });

    // Add player
    user.squad.push(player._id);
    user.budget -= player.marketvalue;
    await user.save();

    res.json({
      message: "Player bought successfully",
      squad: user.squad,
      budget: user.budget,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to buy player" });
  }
};

// ================= SELL PLAYER =================
exports.sellPlayer = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const player = await Player.findById(req.params.playerId);

    if (!user || !player)
      return res.status(404).json({ message: "User or player not found" });

    if (!user.squad.includes(player._id))
      return res.status(400).json({ message: "Player not in your squad" });

    // Remove player from squad & startingXI
    user.squad = user.squad.filter((p) => !p.equals(player._id));
    user.startingXI = user.startingXI.filter((p) => !p.equals(player._id));

    user.budget += player.marketvalue;
    await user.save();

    res.json({
      message: "Player sold successfully",
      squad: user.squad,
      budget: user.budget,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to sell player" });
  }
};

// ================= SET STARTING XI =================
exports.setStartingXI = async (req, res) => {
  try {
    const { startingXI } = req.body; // array of player IDs
    const user = await User.findById(req.user._id).populate("squad");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure all selected players belong to the user
    const players = await Player.find({ _id: { $in: startingXI } });
    const validPlayers = players.filter((p) =>
      user.squad.some((teamPlayer) => teamPlayer._id.equals(p._id))
    );

    if (validPlayers.length !== startingXI.length) {
      return res.status(400).json({ message: "Invalid players in starting XI" });
    }

    if (validPlayers.length !== 11) {
      return res.status(400).json({ message: "Starting XI must have exactly 11 players" });
    }

    // === Count positions ===
    const positionCount = { Goalkeeper: 0, Defender: 0, Midfielder: 0, Forward: 0 };
    validPlayers.forEach((p) => {
      if (positionCount[p.position] !== undefined) {
        positionCount[p.position]++;
      }
    });

    // === Allowed formations ===
    const validFormations = [
      { Goalkeeper: 1, Defender: 4, Midfielder: 4, Forward: 2 }, // 4-4-2
      { Goalkeeper: 1, Defender: 4, Midfielder: 3, Forward: 3 }, // 4-3-3
      { Goalkeeper: 1, Defender: 3, Midfielder: 5, Forward: 2 }, // 3-5-2
      { Goalkeeper: 1, Defender: 5, Midfielder: 3, Forward: 2 }, // 5-3-2
      { Goalkeeper: 1, Defender: 4, Midfielder: 5, Forward: 1 }, // 4-5-1
    ];

    const isValidFormation = validFormations.some(
      (f) =>
        f.Goalkeeper === positionCount.Goalkeeper &&
        f.Defender === positionCount.Defender &&
        f.Midfielder === positionCount.Midfielder &&
        f.Forward === positionCount.Forward
    );

    if (!isValidFormation) {
      return res.status(400).json({
        message: "Invalid formation. Allowed: 4-4-2, 4-3-3, 3-5-2, 5-3-2, 4-5-1",
      });
    }

    // Save the Starting XI
    user.startingXI = startingXI;
    await user.save();

    res.json({
      message: "Starting XI set successfully",
      startingXI: user.startingXI,
      formation: `${positionCount.Defender}-${positionCount.Midfielder}-${positionCount.Forward}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
