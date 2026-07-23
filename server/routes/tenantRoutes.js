const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const tenantController = require("../controllers/tenantController");

router.get(
    "/dashboard",
    authenticate,
    authorize("TENANT"),
    tenantController.getTenantDashboard
);

router.post(
    "/",
    authenticate,
    authorize("OWNER"),
    tenantController.createTenant
);

router.get(
    "/",
    authenticate,
    authorize("OWNER"),
    tenantController.getTenants
);

router.put(
    "/:id",
    authenticate,
    authorize("OWNER"),
    tenantController.updateTenant
);

router.delete(
    "/:id",
    authenticate,
    authorize("OWNER"),
    tenantController.deleteTenant
);

module.exports = router;