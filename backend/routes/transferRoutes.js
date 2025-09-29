// backend/routes/transferRoutes.js
const express = require("express");
const router = express.Router();
const transferController = require("../controllers/transferController");
const protect = require("../middleware/authMiddleware");

// ================== TEAMS ==================
// Get all teams with their players
router.get("/teams", transferController.getAllTeams);

// Get a single team by name with its players
router.get("/teams/:name", transferController.getTeamByName);

// ================== PLAYERS / SQUAD ==================
// Get all players in the market
router.get("/players", transferController.getAllPlayers);

// Get the logged-in user's squad
router.get("/mysquad", protect, transferController.getMySquad);

// ================== BUY / SELL PLAYERS ==================
// Buy a player by playerId
router.post("/buy/:playerId", protect, transferController.buyPlayer);

// Sell a player by playerId
router.post("/sell/:playerId", protect, transferController.sellPlayer);

// ================== LINEUP / FORMATION ==================
// Set the starting XI (subset of squad)
router.post("/startingXI", protect, transferController.setStartingXI);

// Change formation (e.g., "4-4-2")
router.post("/formation", protect, transferController.changeFormation);

// ================== FANTASY TEAM ==================
// Get full team info (squad + startingXI)
router.get("/my-team", protect, transferController.getMyTeam);

// Get dashboard summary (budget, points, squad size)
router.get("/dashboard", protect, transferController.getDashboard);

// Set or update user's fantasy team name
router.post("/team-name", protect, transferController.setTeamName);

// ================== GROUPS ==================
// Create a new group
router.post("/groups/create", protect, transferController.createGroup);

// Join an existing group
router.post("/groups/join", protect, transferController.joinGroup);

// Leave a group
router.post("/groups/leave", protect, transferController.leaveGroup);

// Get all groups of a specific user
router.get("/groups/:userId", protect, transferController.getUserGroups);

module.exports = router;
