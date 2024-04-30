const mongoose = require("mongoose");
const Schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "none",
    },
    password: {
      type: String,
      default: "none",
    },
    project: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Projects",
      },
    ],
    role: {
      type: String,
    },
    token: {
      type: String,
      default: "none",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", Schema);
module.exports = User;
