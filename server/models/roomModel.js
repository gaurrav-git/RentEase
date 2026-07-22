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

const updateRoom = async (id, roomData) => {
    const [result] = await db.execute(
        `UPDATE rooms
         SET room_number=?, capacity=?, rent=?, status=?
         WHERE id=?`,
        [
            roomData.room_number,
            roomData.capacity,
            roomData.rent,
            roomData.status,
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
    getRoomById,
    updateRoom,
    deleteRoom,
};