const db = require("../config/db");

const createRoom = async (roomData) => {
    const [result] = await db.execute(
        `INSERT INTO rooms
        (property_id, room_number, capacity, rent)
        VALUES (?, ?, ?, ?)`,
        [
            roomData.property_id,
            roomData.room_number,
            roomData.capacity,
            roomData.rent,
        ]
    );

    return result.insertId;
};

const getRoomsByProperty = async (propertyId) => {
    const [rows] = await db.execute(
        "SELECT * FROM rooms WHERE property_id = ?",
        [propertyId]
    );

    return rows;
};

const getRoomById = async (id) => {
    const [rows] = await db.execute(
        "SELECT * FROM rooms WHERE id = ?",
        [id]
    );

    return rows[0];
};

const getRoomsByOwner = async (ownerId) => {
    const [rows] = await db.execute(
        `
        SELECT
            r.*,
            p.name AS property_name
        FROM rooms r
        INNER JOIN properties p
            ON r.property_id = p.id
        WHERE p.owner_id = ?
        ORDER BY p.name, r.room_number
        `,
        [ownerId]
    );

    return rows;
};

const updateRoom = async (id, roomData) => {
    const [result] = await db.execute(
        `UPDATE rooms
         SET room_number = ?, capacity = ?, rent = ?
         WHERE id = ?`,
        [
            roomData.room_number,
            roomData.capacity,
            roomData.rent,
            id,
        ]
    );

    return result;
};


const deleteRoom = async (id) => {
    const [result] = await db.execute(
        "DELETE FROM rooms WHERE id=?",
        [id]
    );

    return result;
};

module.exports = {
    createRoom,
    getRoomsByProperty,
    getRoomsByOwner,
    getRoomById,
    updateRoom,
    deleteRoom,
};