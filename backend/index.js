require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


// ====== ROUTES ======
const userRoutes = require("./routes/users");        
const transferRoutes = require("./routes/transferRoutes");  
const groupRoutes = require("./routes/groups");      
const leaderboardRoutes = require("./routes/leaderboard"); 
const contactRoutes = require("./routes/contacts");  

const app = express();

// ====== MIDDLEWARE ======
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ====== ROUTES ======
app.use("/api/users", userRoutes);     // ✅ All auth + user stuff here
app.use("/api", transferRoutes);       
app.use("/api/groups", groupRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/contacts", contactRoutes);

// ====== TEST ROOT ======
app.get("/", (req, res) => res.send("🚀 Dority Fantasy Backend Running!"));

// ====== DB CONNECT FUNCTION ======
async function connectDB() {
  const MONGO_URI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fantasydb";

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

module.exports = { app, connectDB };
