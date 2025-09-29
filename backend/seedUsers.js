const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fantasydb")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

const seedUsers = async () => {
  try {
    const users = await User.find({});
    for (let user of users) {
      if (!user.team) user.team = [];
      if (!user.budget) user.budget = 100;
      if (!user.totalPoints) user.totalPoints = 0;
      await user.save();
    }
    console.log("Users updated with team and budget!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();
