const db = require("../config/db");

const getAllTenants = async () => {
    const [rows] = await db.execute(
        `SELECT id, name, email, phone, room_id
         FROM users
         WHERE role='TENANT'`
    );

    return rows;
};

const assignRoom = async (tenantId, roomId) => {
    const [result] = await db.execute(
        "UPDATE users SET room_id=? WHERE id=? AND role='TENANT'",
        [roomId, tenantId]
    );

    return result;
};

module.exports = {
    getAllTenants,
    assignRoom,
};