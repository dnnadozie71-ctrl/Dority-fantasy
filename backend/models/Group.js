// backend/models/Group.js
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: String,
  code: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Group", groupSchema);
 