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
        `SELECT * FROM rent_payments
         ORDER BY payment_date DESC`
    );

    return rows;
};

module.exports = {
    createPayment,
    getPayments,
};