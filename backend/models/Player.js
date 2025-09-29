// backend/models/Player.js
const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: String, required: true },
  position: { type: String, required: true },
  marketvalue: { type: Number, required: true },
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model("Player", playerSchema);
