const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const paymentController = require("../controllers/paymentController");

router.post(
    "/",
    authenticate,
    authorize("OWNER"),
    paymentController.createPayment
);

router.get(
    "/",
    authenticate,
    authorize("OWNER"),
    paymentController.getPayments
);

module.exports = router;