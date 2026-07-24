const express = require("express");

const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const complaintController = require("../controllers/complaintController");

router.post(
    "/",
    authenticate,
    authorize("TENANT"),
    complaintController.createComplaint
);

router.get(
    "/",
    authenticate,
    authorize("OWNER"),
    complaintController.getComplaints
);

router.put(
    "/:id",
    authenticate,
    authorize("OWNER"),
    complaintController.updateComplaintStatus
);

router.get(
    "/my-complaints",
    authenticate,
    authorize("TENANT"),
    complaintController.getMyComplaints
);

module.exports = router;