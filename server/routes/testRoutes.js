const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/owner",
    authenticate,
    authorize("OWNER"),
    (req, res) => {

        res.json({
            success: true,
            message: "Welcome Owner",
            user: req.user,
        });

    }
);

router.get(
    "/tenant",
    authenticate,
    authorize("TENANT"),
    (req, res) => {

        res.json({
            success: true,
            message: "Welcome Tenant",
            user: req.user,
        });

    }
);

module.exports = router;