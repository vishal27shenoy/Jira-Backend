const express = require("express");
const router = express.Router();
const managerController = require("../controllers/manager.controller");
router
  .route("/")
  .post(managerController.addProjects)
  .put(managerController.addDeveloper)
  .delete(managerController.removeDeveloper);
router.route("/getDeveloper").get(managerController.getDeveloper);
router.route("/search").get(managerController.searchDevelopers);
module.exports = router;
