const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const propertyController = require("../controllers/propertyController");

router.post(
    "/",
    authenticate,
    authorize("OWNER"),
    propertyController.createProperty
);

router.get(
    "/",
    authenticate,
    authorize("OWNER"),
    propertyController.getProperties
);

router.put(
    "/:id",
    authenticate,
    authorize("OWNER"),
    propertyController.updateProperty
);

router.delete(
    "/:id",
    authenticate,
    authorize("OWNER"),
    propertyController.deleteProperty
);

module.exports = router;