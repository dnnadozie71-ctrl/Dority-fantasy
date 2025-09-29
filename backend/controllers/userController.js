const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Import jwt once at the top
const User = require("../models/User");
const Player = require("../models/Player");

// REGISTER
exports.register = async (req, res) => {
  const { username, email, password, teamName, selectedPlayers } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: "All fields required" });

  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Validate selected players if provided
    let validatedPlayers = [];
    if (selectedPlayers && selectedPlayers.length > 0) {
      const players = await Player.find({ _id: { $in: selectedPlayers } });
      validatedPlayers = players.map(p => p._id);
      console.log(`User ${username} selected ${validatedPlayers.length} players during signup`);
    }
    
    const user = new User({
      username,
      email,
      password: hashedPassword,
      teamName: teamName || `${username}'s Team`, // Set team name or default
      squad: validatedPlayers, // Add selected players to squad
      budget: 100 - (validatedPlayers.length * 5), // Reduce budget based on selected players (assuming 5 per player)
      points: 0,
      totalPoints: 0,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Return user with populated squad for immediate display
    const populatedUser = await User.findById(user._id).populate("squad");

    res.status(201).json({ 
      token, 
      user: {
        _id: populatedUser._id,
        username: populatedUser.username,
        email: populatedUser.email,
        teamName: populatedUser.teamName,
        budget: populatedUser.budget,
        squad: populatedUser.squad,
        points: populatedUser.points,
        totalPoints: populatedUser.totalPoints,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------------------------------------------------------------------

// LOGIN (supports email or username)
exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: "Email/Username and password are required" });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).populate("squad");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" }); // Use a generic message for security
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign( // Use the imported jwt
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        teamName: user.teamName,
        budget: user.budget,
        squad: user.squad,
        points: user.points,
        totalPoints: user.totalPoints,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------------------------------------------------------------------

// GET ALL USERS (Leaderboard)
exports.getAllUsers = async (req, res) => {
  try {
    // Select specific fields for the leaderboard to avoid sending sensitive data
    const users = await User.find().select("username totalPoints").sort({ totalPoints: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};