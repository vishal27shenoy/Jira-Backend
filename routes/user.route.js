const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const controller = require("../controllers/manager.controller");
router.route("/auth").post(userController.Register).put(userController.Login);
router.route("/project").get(controller.getAllProject);

module.exports = router;
