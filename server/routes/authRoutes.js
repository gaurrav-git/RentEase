const express = require("express");
const { validationResult } = require("express-validator");

const authController = require("../controllers/authController");
const {
    registerValidation,
    loginValidation,
} = require("../validations/authValidation");

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    next();
};

router.post(
    "/register",
    registerValidation,
    validate,
    authController.registerOwner
);

router.post(
    "/login",
    loginValidation,
    validate,
    authController.login
);

module.exports = router;