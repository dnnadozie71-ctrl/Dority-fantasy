// Development server that runs without MongoDB
require('dotenv').config();
const express = require("express");
const cors = require("cors");

// Mock data
const mockPlayers = require("./fantasydb.players.json");

const app = express();
const PORT = process.env.PORT || 5000;

// ====== MIDDLEWARE ======
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ====== MOCK ROUTES FOR DEVELOPMENT ======
app.get("/", (req, res) => {
  res.send("🚀 Dority Fantasy Backend Running! (Development Mode)");
});

// Get all players
app.get("/api/players", (req, res) => {
  res.json(mockPlayers);
});

// Mock auth routes
app.post("/api/users/login", (req, res) => {
  res.json({ 
    message: "Login successful (mock)", 
    token: "mock-token",
    user: { 
      _id: "mock-user-id", 
      username: "testuser", 
      email: "test@example.com",
      budget: 100,
      squad: [],
      points: 0,
      totalPoints: 0 
    }
  });
});

app.post("/api/users/register", (req, res) => {
  res.json({ 
    message: "Registration successful (mock)", 
    token: "mock-token",
    user: { 
      _id: "mock-user-id", 
      username: req.body.username || "newuser", 
      email: req.body.email || "new@example.com",
      budget: 100,
      squad: [],
      points: 0,
      totalPoints: 0 
    }
  });
});

// Mock transfer routes
app.get("/api/my-team", (req, res) => {
  res.json({
    squad: [],
    budget: 100,
    teamName: "My Team",
    startingXI: [],
    formation: "4-4-2"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    mode: "development",
    database: "mock",
    timestamp: new Date().toISOString()
  });
});

// Catch all for unimplemented routes
app.use("/api/*", (req, res) => {
  res.status(501).json({ 
    message: "This endpoint is not implemented in development mode",
    endpoint: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development Server running on http://localhost:${PORT}`);
  console.log(`📊 Serving ${mockPlayers.length} mock players`);
  console.log(`🔧 Running in development mode (no database required)`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /                  - Health check`);
  console.log(`  GET  /api/players       - Get all players`);
  console.log(`  POST /api/users/login   - Mock login`);
  console.log(`  POST /api/users/register - Mock registration`);
  console.log(`  GET  /api/my-team       - Mock team data`);
  console.log(`  GET  /api/health        - API health check`);
});
