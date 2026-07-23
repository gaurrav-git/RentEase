const db = require("../config/db");

const createNotice = async (noticeData, userId) => {
    const [result] = await db.execute(
        `INSERT INTO notices (title, description, created_by)
         VALUES (?, ?, ?)`,
        [
            noticeData.title,
            noticeData.description,
            userId,
        ]
    );

    return result;
};

const getAllNotices = async () => {
    const [rows] = await db.execute(`
        SELECT
            n.id,
            n.title,
            n.description,
            n.created_at,
            u.name AS owner_name
        FROM notices n
        JOIN users u
            ON n.created_by = u.id
        ORDER BY n.created_at DESC
    `);

    return rows;
};

const deleteNotice = async (id) => {
    await db.execute(
        "DELETE FROM notices WHERE id = ?",
        [id]
    );
};

module.exports = {
    createNotice,
    getAllNotices,
    deleteNotice,
};