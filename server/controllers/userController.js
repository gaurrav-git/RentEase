const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const changeEmail = async (req, res) => {
    try {
        const { newEmail } = req.body;
        const userId = req.user.id;

        if (!newEmail) {
            return res.status(400).json({
                success: false,
                message: "New email is required",
            });
        }

        const existingUser = await userModel.findUserByEmail(newEmail);

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        await userModel.updateEmail(userId, newEmail);

        return res.json({
            success: true,
            message: "Email updated successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await userModel.findUserById(userId);

        const fullUser = await userModel.findUserByEmail(user.email);

        const isMatch = await bcrypt.compare(
            currentPassword,
            fullUser.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userModel.updatePassword(userId, hashedPassword);

        return res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    changeEmail,
    changePassword,
};