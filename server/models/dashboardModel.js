const db = require("../config/db");

const getDashboardStats = async () => {

    const [[property]] = await db.execute(
        "SELECT COUNT(*) AS totalProperties FROM properties"
    );

    const [[room]] = await db.execute(
        "SELECT COUNT(*) AS totalRooms FROM rooms"
    );

    const [[vacant]] = await db.execute(
    `SELECT COUNT(*) AS vacantRooms
     FROM rooms
     WHERE occupied < capacity`
    );

    const [[occupied]] = await db.execute(
    `SELECT COUNT(*) AS occupiedRooms
     FROM rooms
     WHERE occupied = capacity`
    );

    const [[tenant]] = await db.execute(
    `SELECT COUNT(*) AS totalTenants
     FROM tenants
     WHERE status = 'ACTIVE'`
    );

    const [[payment]] = await db.execute(
        "SELECT COUNT(*) AS totalPayments FROM rent_payments"
    );

    const [[complaint]] = await db.execute(
    "SELECT COUNT(*) AS openComplaints FROM complaints WHERE status='OPEN'"
    );

    const [pendingPayments] = await db.execute(`
    SELECT
    u.name AS tenant_name,
    p.name AS property_name,
    r.room_number,
    rp.amount,
    rp.payment_date,
    rp.status
    FROM rent_payments rp
    JOIN tenants t ON rp.tenant_id = t.user_id
    JOIN users u ON t.user_id = u.id
    JOIN rooms r ON rp.room_id = r.id
    JOIN properties p ON r.property_id = p.id
    WHERE rp.status = 'PENDING'
    ORDER BY rp.payment_date ASC
    LIMIT 10;
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

    const [revenue] = await db.execute(`
    SELECT COALESCE(SUM(amount), 0) AS totalRevenue
    FROM rent_payments
    WHERE status = 'PAID'
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
    totalRevenue : revenue[0].totalRevenue,
    pendingPayments,
    recentComplaints,
};
};

module.exports = {
    getDashboardStats,
};