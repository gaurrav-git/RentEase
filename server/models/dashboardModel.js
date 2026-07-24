const db = require("../config/db");

const getDashboardStats = async (ownerId) => {

    const [[property]] = await db.execute(
        "SELECT COUNT(*) AS totalProperties FROM properties WHERE owner_id = ?",[ownerId]
    );

    const [[room]] = await db.execute(
        "SELECT COUNT(*) AS totalRooms FROM rooms r JOIN properties p ON r.property_id = p.id WHERE p.owner_id = ?",[ownerId]
    );

    const [[vacant]] = await db.execute(
    `SELECT COUNT(*) AS vacantRooms
FROM rooms r
JOIN properties p ON r.property_id = p.id
WHERE r.occupied < r.capacity
AND p.owner_id = ?;`,[ownerId]
    );

    const [[occupied]] = await db.execute(
    `SELECT COUNT(*) AS occupiedRooms
FROM rooms r
JOIN properties p ON r.property_id = p.id
WHERE r.occupied = r.capacity
AND p.owner_id = ?;`,[ownerId]
    );

    const [[tenant]] = await db.execute(
    `SELECT COUNT(*) AS totalTenants
FROM tenants t
JOIN rooms r ON t.room_id = r.id
JOIN properties p ON r.property_id = p.id
WHERE p.owner_id = ?
AND t.status='ACTIVE'`,[ownerId]
    );

    const [[payment]] = await db.execute(
        `SELECT COUNT(*) AS totalPayments
FROM rent_payments rp
JOIN rooms r
    ON rp.room_id = r.id
JOIN properties p
    ON r.property_id = p.id
WHERE p.owner_id = ?;`,[ownerId]
    );

    const [[complaint]] = await db.execute(
    `SELECT COUNT(*) AS openComplaints
FROM complaints c
JOIN tenants t
    ON c.tenant_id = t.user_id
JOIN rooms r
    ON t.room_id = r.id
JOIN properties p
    ON r.property_id = p.id
WHERE c.status = 'OPEN'
AND p.owner_id = ?;`,[ownerId]);

    const [pendingPayments] = await db.execute(`
    SELECT
    u.name AS tenant_name,
    p.name AS property_name,
    r.room_number,
    rp.amount,
    rp.payment_date,
    rp.status
FROM rent_payments rp
JOIN tenants t
    ON rp.tenant_id = t.user_id
JOIN users u
    ON t.user_id = u.id
JOIN rooms r
    ON rp.room_id = r.id
JOIN properties p
    ON r.property_id = p.id
WHERE rp.status = 'PENDING'
AND p.owner_id = ?
ORDER BY rp.payment_date ASC
LIMIT 10;
    `,[ownerId]);

    const [recentComplaints] = await db.execute(`
    SELECT
    c.id,
    u.name AS tenantName,
    c.title,
    c.status,
    c.priority,
    c.created_at
FROM complaints c
JOIN tenants t
    ON c.tenant_id = t.user_id
JOIN users u
    ON t.user_id = u.id
JOIN rooms r
    ON t.room_id = r.id
JOIN properties p
    ON r.property_id = p.id
WHERE p.owner_id = ?
ORDER BY c.created_at DESC
LIMIT 5;
    `,[ownerId]);

    const [revenue] = await db.execute(`
    SELECT COALESCE(SUM(rp.amount),0) AS totalRevenue
FROM rent_payments rp
JOIN rooms r
    ON rp.room_id = r.id
JOIN properties p
    ON r.property_id = p.id
WHERE rp.status = 'PAID'
AND p.owner_id = ?;
`,[ownerId]);

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