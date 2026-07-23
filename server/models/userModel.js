const db = require("../config/db");

const findUserByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
};

const createUser = async (userData) => {
    const { name, email, password, role, phone } = userData;

    const [result] = await db.query(
        `INSERT INTO users
        (name, email, password, role, phone)
        VALUES (?, ?, ?, ?, ?)`,
        [name, email, password, role, phone]
    );

    return result.insertId;
};

const findUserById = async (id) => {
    const [rows] = await db.query(
        "SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?",
        [id]
    );

    return rows[0];
};

const updateEmail = async (userId, newEmail) => {
    await db.query(
        "UPDATE users SET email = ? WHERE id = ?",
        [newEmail, userId]
    );
};

const updatePassword = async (userId, hashedPassword) => {
    await db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId]
    );
};

module.exports = {
    findUserByEmail,
    createUser,
    findUserById,
    updateEmail,
    updatePassword,
};