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

    return {
        ...property,
        ...room,
        ...vacant,
        ...occupied,
        ...tenant,
        ...payment,
        ...complaint,
    };
};

module.exports = {
    getDashboardStats,
};