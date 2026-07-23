const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const {
    changeEmail,
    changePassword,
} = require("../controllers/userController");

router.put("/change-email", authenticate, changeEmail);

router.put("/change-password", authenticate, changePassword);

module.exports = router;