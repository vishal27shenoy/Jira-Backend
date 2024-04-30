const Tickets = require("../models/ticket.model");
const addTicket = async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, projectID, assignedBY } = req.body;
    if (
      title.trim() == "" ||
      description.trim() == "" ||
      projectID.trim() == "" ||
      assignedBY.trim() == ""
    ) {
      return res.status(204).json({ message: "Invalid Credentials" });
    }

    const createTicket = new Tickets({
      title: title,
      description: description,
      projectID: projectID,
      assignedBY: assignedBY,
    });

    const ticketSaved = await createTicket.save();
    if (ticketSaved) {
      return res.status(200).json({ message: "Ticket created Successfully" });
    } else {
      return res.status(400).json({ message: "Bad Request" });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateTakenBY = async (req, res) => {
  try {
    const { ticketID, userID } = req.body;

    if (ticketID?.trim() == "" || userID?.trim() == "") {
      return res.status(204).json({ message: "Invalid Credentials" });
    }

    const ticketFound = await Tickets.findOne({ _id: ticketID });
    if (ticketFound) {
      ticketFound.takenBY = userID;
      const modifiedTicket = await ticketFound.save();
      if (modifiedTicket) {
        return res.status(200).json({ message: "Ticket Updated Successfully" });
      } else {
        return res.status(400).json({ message: "Bad Request" });
      }
    } else {
      return res.status(400).json({ message: "Ticket not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateStatus = async (req,res) => {
  try {
    const { ticketID, status } = req.body;

    if (ticketID?.trim() == "" || status?.trim() == "") {
      return res.status(204).json({ message: "Invalid Credentials" });
    }

    const ticketFound = await Tickets.findOne({ _id: ticketID });
    if (ticketFound) {
      ticketFound.status = status;
      const modifiedTicket = await ticketFound.save();
      if (modifiedTicket) {
        return res.status(200).json({ message: "Status Updated Successfully" });
      } else {
        return res.status(400).json({ message: "Bad Request" });
      }
    } else {
      return res.status(400).json({ message: "Ticket not found" });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const projectID = req.query.projectID;
    const ticketFound = await Tickets.findOne({ projectID: projectID });
    if (ticketFound) {
      return res
        .status(200)
        .json({ message: "Ticked Found", data: ticketFound });
    } else {
      return res.status(400).json({ message: "Ticket Does not Exist" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addPublicNote = async (req, res) => {
  try {
    const { description, ticketID, userID } = req.body;
    const done = await Tickets.updateOne(
      { _id: ticketID },
      {
        $push: {
          publicNote: {
            description: description,
            from: userID,
          },
        },
      }
    );
    if (done) {
      return res.status(200).json({ message: "Added Comment" });
    } else {
      return res.status(400).json({ message: "Ticket Does not Exist" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addInternalNote = async (req, res) => {
  try {
    const { description, from, mention, ticketID } = req.body;
    const done = await Tickets.updateOne(
      { _id: ticketID },
      {
        $push: {
          internalNote: {
            description: description,
            from: from,
            mention: mention,
          },
        },
      }
    );
    if (done) {
      return res.status(200).json({ message: "Added Comment" });
    } else {
      return res.status(400).json({ message: "Ticket Does not Exist" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addTicket,
  updateStatus,
  updateTakenBY,
  getAllTickets,
  addPublicNote,
  addInternalNote,
};
