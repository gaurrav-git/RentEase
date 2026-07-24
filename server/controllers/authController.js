const authService = require("../services/authService");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const registerOwner = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if email already exists
        const existingUser = await userModel.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create owner
        await userModel.createUser({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "OWNER",
        });

        return res.status(201).json({
            success: true,
            message: "Owner registered successfully",
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};  

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await authService.loginUser(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    registerOwner,
    login,
};