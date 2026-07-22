const db = require("../config/db");

const createComplaint = async (complaintData) => {
    const [result] = await db.execute(
        `INSERT INTO complaints
        (tenant_id, room_id, title, description, priority)
        VALUES (?, ?, ?, ?, ?)`,
        [
            complaintData.tenant_id,
            complaintData.room_id,
            complaintData.title,
            complaintData.description,
            complaintData.priority,
        ]
    );

    return result.insertId;
};

const getComplaints = async () => {
    const [rows] = await db.execute(
        "SELECT * FROM complaints ORDER BY created_at DESC"
    );

    return rows;
};

const updateComplaintStatus = async (id, status) => {
    const [result] = await db.execute(
        "UPDATE complaints SET status=? WHERE id=?",
        [status, id]
    );

    return result;
};

module.exports = {
    createComplaint,
    getComplaints,
    updateComplaintStatus,
};