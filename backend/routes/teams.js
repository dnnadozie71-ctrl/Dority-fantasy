const express = require("express");
const router = express.Router();
const transferController = require("../controllers/transferController");
const authMiddleware = require("../middleware/authMiddleware");

// REAL TEAMS
router.get("/all", transferController.getAllTeams);
router.get("/real/:name", transferController.getTeamByName);

// USER FANTASY TEAM
router.get("/my-team", authMiddleware, transferController.getMyTeam);
router.get("/dashboard", authMiddleware, transferController.getDashboard);
router.post("/buy/:playerId", authMiddleware, transferController.buyPlayer);
router.post("/sell/:playerId", authMiddleware, transferController.sellPlayer);
router.post("/pick", authMiddleware, transferController.setStartingXI);
router.put("/team-name", authMiddleware, transferController.updateTeamName);

module.exports = router;