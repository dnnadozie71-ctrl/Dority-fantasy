const mongoose = require('mongoose');
const Player = require('./models/Player');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fantasydb')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

async function updatePoints(playerUpdates) {
  try {
    for (let update of playerUpdates) {
      const player = await Player.findById(update.playerId);
      if (player) {
        player.points += update.points;
        await player.save();
      }
    }

    const users = await User.find();
    for (let user of users) {
      let totalPoints = 0;
      if (user.team && user.team.length > 0) {
        for (let playerId of user.team) {
          const player = await Player.findById(playerId);
          if (player) totalPoints += player.points;
        }
      }
      user.totalPoints = totalPoints;
      await user.save();
    }

    console.log('Points updated successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// Example usage
const updates = [
  // { playerId: "PLAYER_ID", points: 5 },
];
updatePoints(updates);
