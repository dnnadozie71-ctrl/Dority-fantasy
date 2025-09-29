const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    budget: {
      type: Number,
      default: 100,
    },

    // Full squad (up to 15 players from transfer market)
    squad: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],

    // Picked starting XI (subset of squad, max 11 players)
    startingXI: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],

    points: {
      type: Number,
      default: 0,
    },

    totalPoints: {
      type: Number,
      default: 0,
    },

    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],

    formation: {
  type: String,
  default: "4-4-2",
},


    teamName: {
      type: String,
      default: "",
    },
  },

  { timestamps: true }
);
userSchema.virtual("squadCount").get(function () {
  return this.squad.length;
});

userSchema.virtual("startingCount").get(function () {
  return this.startingXI.length;
});




module.exports = mongoose.model("User", userSchema);
