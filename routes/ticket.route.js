const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controller");
router.route("/").post(ticketController.addTicket).put(ticketController.updateStatus).patch(ticketController.updateTakenBY).get(ticketController.getAllTickets);
router.route("/publicNote").post(ticketController.addPublicNote);
router.route("/internalNote").post(ticketController.addInternalNote);
module.exports = router;