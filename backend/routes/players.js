const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); 
const transferController = require("../controllers/transferController");

// Routes
router.get("/", transferController.getAllPlayers);
router.get("/my-team", authMiddleware, transferController.getMyTeam);
router.post("/buy/:playerId", authMiddleware, transferController.buyPlayer);
router.post("/sell/:playerId", authMiddleware, transferController.sellPlayer);
router.post("/set-xi", authMiddleware, transferController.setStartingXI);

module.exports = router;
