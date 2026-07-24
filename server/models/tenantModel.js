const db = require("../config/db");

const createTenant = async (userId, tenantData) => {
    const [result] = await db.execute(
        `INSERT INTO tenants
        (user_id, room_id, phone, aadhaar, occupation, joining_date, security_deposit, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            tenantData.room_id,
            tenantData.phone,
            tenantData.aadhaar,
            tenantData.occupation,
            tenantData.joining_date,
            tenantData.security_deposit,
            "ACTIVE",
        ]
    );

    return result;
};

const getAllTenants = async () => {
    const [rows] = await db.execute(`
        SELECT
            t.id,
            t.user_id,
            t.room_id,
            u.name,
            u.email,
            t.phone,
            t.aadhaar,
            t.occupation,
            t.joining_date,
            t.security_deposit,
            t.status,
            r.room_number,
            p.name AS property_name
        FROM tenants t
        JOIN users u ON t.user_id = u.id
        JOIN rooms r ON t.room_id = r.id
        JOIN properties p ON r.property_id = p.id
        ORDER BY t.created_at DESC
    `);

    return rows;
};

const updateTenant = async (id, tenantData) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Get current tenant details
        const [tenantRows] = await connection.execute(
            `SELECT user_id, room_id
             FROM tenants
             WHERE id = ?`,
            [id]
        );

        if (tenantRows.length === 0) {
            throw new Error("Tenant not found");
        }

        const userId = tenantRows[0].user_id;
        const oldRoomId = tenantRows[0].room_id;
        const newRoomId = Number(tenantData.room_id);

        // Update user name
        await connection.execute(
            `UPDATE users
             SET name = ?
             WHERE id = ?`,
            [
                tenantData.name,
                userId,
            ]
        );

        console.log("Old Room:", oldRoomId);
        console.log("New Room:", newRoomId);

        // Update occupancies
if (oldRoomId !== newRoomId) {
    // Remove from old room
    await connection.execute(
        `UPDATE rooms
         SET occupied = occupied - 1
         WHERE id = ? AND occupied > 0`,
        [oldRoomId]
    );

    // Add to new room
    await connection.execute(
        `UPDATE rooms
         SET occupied = occupied + 1
         WHERE id = ?`,
        [newRoomId]
    );
}

// Update tenant
await connection.execute(
    `UPDATE tenants
     SET room_id = ?,
         phone = ?,
         occupation = ?
     WHERE id = ?`,
    [
        newRoomId,
        tenantData.phone,
        tenantData.occupation,
        id,
    ]
);

// NOW update status
await connection.execute(
    `UPDATE rooms
     SET status =
        CASE
            WHEN occupied >= capacity THEN 'OCCUPIED'
            ELSE 'VACANT'
        END
     WHERE id IN (?, ?)`,
    [oldRoomId, newRoomId]
);
        await connection.commit();

        return true;

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }
};

const getTenantDashboard = async (userId) => {
    const [rows] = await db.execute(
        `
        SELECT
            u.name,
            u.email,
            t.phone,
            t.joining_date,
            t.security_deposit,
            r.room_number,
            r.rent,
            p.name AS property_name
        FROM tenants t
        JOIN users u
            ON t.user_id = u.id
        JOIN rooms r
            ON t.room_id = r.id
        JOIN properties p
            ON r.property_id = p.id
        WHERE t.user_id = ?
        `,
        [userId]
    );

    return rows[0];
};

const deleteTenant = async (id) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Get tenant details
        const [tenantRows] = await connection.execute(
            `SELECT user_id, room_id
             FROM tenants
             WHERE id = ?`,
            [id]
        );

        if (tenantRows.length === 0) {
            throw new Error("Tenant not found");
        }

        const { user_id, room_id } = tenantRows[0];

        // Delete tenant record
        await connection.execute(
            "DELETE FROM tenants WHERE id = ?",
            [id]
        );

        // Delete user account
        await connection.execute(
            "DELETE FROM users WHERE id = ?",
            [user_id]
        );

        // Decrease occupied count
        await connection.execute(
            `UPDATE rooms
             SET occupied = occupied - 1
             WHERE id = ? AND occupied > 0`,
            [room_id]
        );

        // Update room status
        await connection.execute(
            `
            UPDATE rooms
            SET status =
                CASE
                    WHEN occupied >= capacity THEN 'OCCUPIED'
                    ELSE 'VACANT'
                END
            `
        );

        await connection.commit();

        return true;

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }
};

const getTenantByUserId = async (userId) => {
    const [rows] = await db.execute(
        "SELECT * FROM tenants WHERE user_id = ?",
        [userId]
    );

    return rows[0];
};

module.exports = {
    createTenant,
    getAllTenants,
    updateTenant,
    deleteTenant,
    getTenantDashboard,
    getTenantByUserId,
};