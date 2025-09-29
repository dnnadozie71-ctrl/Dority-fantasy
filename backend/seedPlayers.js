// seedPlayers.js
const mongoose = require('mongoose');
const Player = require('./models/Player');
require('dotenv').config();

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    // no need for useNewUrlParser or useUnifiedTopology in Mongoose 6+
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Player data
const playersData = [
  // ... your teams and players ...
];

// Flatten player objects
const allPlayers = [];
playersData.forEach(team => {
  team.players.forEach(p => allPlayers.push(p));
});

// Insert into DB
Player.insertMany(allPlayers)
  .then(() => {
    console.log("Players seeded successfully!");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("Error seeding players:", err);
    mongoose.disconnect();
  });
