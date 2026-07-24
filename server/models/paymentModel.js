const db = require("../config/db");

const createPayment = async (paymentData) => {
    const [result] = await db.execute(
        `INSERT INTO rent_payments
        (tenant_id, room_id, amount, payment_date, status)
        VALUES (?, ?, ?, ?, ?)`,
        [
            paymentData.tenant_id,
            paymentData.room_id,
            paymentData.amount,
            paymentData.payment_date,
            paymentData.status,
        ]
    );

    return result.insertId;
};

const getPayments = async () => {
    const [rows] = await db.execute(
        `SELECT
            rp.id,
            rp.tenant_id,
            rp.room_id,
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
        ORDER BY rp.payment_date DESC`
    );

    return rows;
};

const getPaymentsByTenant = async (userId) => {
    const [rows] = await db.execute(
        `SELECT
            rp.id,
            rp.amount,
            rp.payment_date,
            rp.status,
            r.room_number,
            p.name AS property_name
        FROM rent_payments rp
        JOIN tenants t ON rp.tenant_id = t.user_id
        JOIN rooms r ON rp.room_id = r.id
        JOIN properties p ON r.property_id = p.id
        WHERE t.user_id = ?
        ORDER BY rp.payment_date DESC`,
        [userId]
    );

    return rows;
};

const getTenantPaymentStats = async (userId) => {
    const [rows] = await db.execute(
        `SELECT
            COALESCE(SUM(CASE WHEN rp.status='PAID' THEN rp.amount END),0) AS totalPaid,
            COUNT(CASE WHEN rp.status='PENDING' THEN 1 END) AS pendingPayments,
            COALESCE(MAX(r.rent),0) AS monthlyRent
        FROM tenants t
        JOIN rooms r ON t.room_id = r.id
        LEFT JOIN rent_payments rp ON rp.tenant_id = t.user_id
        WHERE t.user_id = ?`,
        [userId]
    );

    return rows[0];
};

const updatePayment = async (id, paymentData) => {
    await db.execute(
        `UPDATE rent_payments
        SET
            tenant_id = ?,
            room_id = ?,
            amount = ?,
            payment_date = ?,
            status = ?
        WHERE id = ?`,
        [
            paymentData.tenant_id,
            paymentData.room_id,
            paymentData.amount,
            paymentData.payment_date,
            paymentData.status,
            id,
        ]
    );
};

const deletePayment = async (id) => {
    await db.execute(
        `DELETE FROM rent_payments WHERE id = ?`,
        [id]
    );
};

module.exports = {
    createPayment,
    getPayments,
    getPaymentsByTenant,
    getTenantPaymentStats,
    updatePayment,
    deletePayment,
};