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

router.get(
    "/my-payments",
    authenticate,
    authorize("TENANT"),
    paymentController.getMyPayments
);

router.delete(
    "/:id",
    authenticate,
    authorize("OWNER"),
    paymentController.deletePayment
);

router.put(
    "/:id",
    authenticate,
    authorize("OWNER"),
    paymentController.updatePayment
);

module.exports = router;