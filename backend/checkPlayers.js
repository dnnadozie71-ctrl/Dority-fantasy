// backend/checkPlayers.js
const mongoose = require("mongoose");
const Player = require("./models/Player");

const MONGO_URI = "mongodb://127.0.0.1:27017/fantasydb"; // use the DB you seeded

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    const players = await Player.find();
    console.log(`Total players found: ${players.length}`);
    players.forEach(p => {
      console.log(`${p.name} - ${p.team} - ${p.position} - ${p.marketvalue}M`);
    });

    mongoose.disconnect();
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
