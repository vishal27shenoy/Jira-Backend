const mongoose = require("mongoose");
const Schema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    projectMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // tickets: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Tickets",
    //   },
    // ],
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Projects = mongoose.model("Projects", Schema);
module.exports = Projects;
