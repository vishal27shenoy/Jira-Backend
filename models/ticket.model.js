const mongoose = require("mongoose");
const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectID : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
    },
    publicNote: [
      {
        description: {
          type: String,
        },
        from :{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }
      },
    ],
    internalNote: [
      {
        description: {
          type: String,
        },
        from :{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        mention: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }],
      },
    ],
    assignedBY: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    takenBY : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status:{
        type:String,
    }
  },
  { timestamps: true }
);

const Tickets = mongoose.model("Tickets", Schema);
module.exports = Tickets;
