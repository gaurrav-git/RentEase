const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const roomController = require("../controllers/roomController");

router.post(
    "/",
    authenticate,
    authorize("OWNER"),
    roomController.createRoom
);

router.get(
    "/",
    authenticate,
    authorize("OWNER"),
    roomController.getRooms
);

router.put(
    "/:id",
    authenticate,
    authorize("OWNER"),
    roomController.updateRoom
);

router.delete(
    "/:id",
    authenticate,
    authorize("OWNER"),
    roomController.deleteRoom
);

module.exports = router;