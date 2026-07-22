const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const { generateToken } = require("../utils/jwt");

const registerUser = async (userData) => {
    const { name, email, password, role, phone } = userData;

    // Check if email already exists
    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const userId = await userModel.createUser({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
    });

    // Get created user
    const user = await userModel.findUserById(userId);

    // Generate JWT
    const token = generateToken(user);

    return {
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
    },
    token,
};
};

const loginUser = async (email, password) => {
    const user = await userModel.findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
        },
        token,
    };
};

module.exports = {
    registerUser,
    loginUser,
};