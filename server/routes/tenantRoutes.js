const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const tenantController = require("../controllers/tenantController");

router.get(
    "/",
    authenticate,
    authorize("OWNER"),
    tenantController.getTenants
);

router.put(
    "/assign-room",
    authenticate,
    authorize("OWNER"),
    tenantController.assignRoom
);

module.exports = router;