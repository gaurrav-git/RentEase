const db = require("../config/db");

const createComplaint = async (complaintData) => {
    const [result] = await db.execute(
        `INSERT INTO complaints
        (tenant_id, room_id, title, description)
        VALUES (?, ?, ?, ?)`,
        [
            complaintData.tenant_id,
            complaintData.room_id,
            complaintData.title,
            complaintData.description,
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

const getComplaintsByTenant = async (userId) => {
    const [rows] = await db.execute(
        `SELECT
            c.id,
            c.title,
            c.description,
            c.priority,
            c.status,
            c.created_at,
            r.room_number,
            p.name AS property_name
        FROM complaints c
        JOIN tenants t
            ON c.tenant_id = t.user_id
        JOIN rooms r
            ON c.room_id = r.id
        JOIN properties p
            ON r.property_id = p.id
        WHERE t.user_id = ?
        ORDER BY c.created_at DESC`,
        [userId]
    );

    return rows;
};

const getTenantComplaintStats = async (userId) => {
    const [rows] = await db.execute(
        `SELECT
            COUNT(CASE WHEN c.status='OPEN' THEN 1 END) AS pending,
            COUNT(CASE WHEN c.status='IN_PROGRESS' THEN 1 END) AS inProgress,
            COUNT(CASE WHEN c.status='RESOLVED' THEN 1 END) AS resolved
        FROM tenants t
        LEFT JOIN complaints c
            ON c.tenant_id = t.user_id
        WHERE t.user_id = ?`,
        [userId]
    );

    return rows[0];
};

module.exports = {
    createComplaint,
    getComplaints,
    updateComplaintStatus,
    getComplaintsByTenant,
    getTenantComplaintStats,
};