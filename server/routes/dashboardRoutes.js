const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const dashboardController = require("../controllers/dashboardController");

router.get(
    "/",
    authenticate,
    authorize("OWNER"),
    dashboardController.getDashboard
);

module.exports = router;