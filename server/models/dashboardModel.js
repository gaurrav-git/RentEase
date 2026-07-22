const db = require("../config/db");

const getDashboardStats = async () => {

    const [[property]] = await db.execute(
        "SELECT COUNT(*) AS totalProperties FROM properties"
    );

    const [[room]] = await db.execute(
        "SELECT COUNT(*) AS totalRooms FROM rooms"
    );

    const [[vacant]] = await db.execute(
        "SELECT COUNT(*) AS vacantRooms FROM rooms WHERE status='VACANT'"
    );

    const [[occupied]] = await db.execute(
        "SELECT COUNT(*) AS occupiedRooms FROM rooms WHERE status='OCCUPIED'"
    );

    const [[tenant]] = await db.execute(
        "SELECT COUNT(*) AS totalTenants FROM users WHERE role='TENANT'"
    );

    const [[payment]] = await db.execute(
        "SELECT COUNT(*) AS totalPayments FROM rent_payments"
    );

    const [[complaint]] = await db.execute(
    "SELECT COUNT(*) AS openComplaints FROM complaints WHERE status='OPEN'"
    );

    const [recentPayments] = await db.execute(`
    SELECT
        rp.id,
        u.name AS tenantName,
        rp.amount,
        rp.payment_date
    FROM rent_payments rp
    JOIN users u ON rp.tenant_id = u.id
    ORDER BY rp.payment_date DESC
    LIMIT 5
    `);

    const [recentComplaints] = await db.execute(`
    SELECT
        c.id,
        u.name AS tenantName,
        c.title,
        c.status,
        c.priority,
        c.created_at
    FROM complaints c
    JOIN users u ON c.tenant_id = u.id
    ORDER BY c.created_at DESC
    LIMIT 5
    `);

    return {
    summary: {
        ...property,
        ...room,
        ...vacant,
        ...occupied,
        ...tenant,
        ...payment,
        ...complaint,
    },
    recentPayments,
    recentComplaints,
};
};

module.exports = {
    getDashboardStats,
};