const db = require("../config/db");
const paymentModel = require("../models/paymentModel");

const createPayment = async (req, res) => {
    try {
        console.log("Payment Body:", req.body);

        const [room] = await db.execute(
    `
    SELECT r.id
    FROM rooms r
    JOIN properties p
        ON r.property_id = p.id
    WHERE r.id = ?
    AND p.owner_id = ?
    `,
    [req.body.room_id, req.user.id]
);

if (room.length === 0) {
    return res.status(403).json({
        success: false,
        message: "Unauthorized room",
    });
}

        const paymentId = await paymentModel.createPayment(req.body);

        res.status(201).json({
            success: true,
            message: "Payment recorded successfully",
            paymentId,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getPayments = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const payments = await paymentModel.getPayments(ownerId);

        res.json({
            success: true,
            data: payments,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getMyPayments = async (req, res) => {

    const payments = await paymentModel.getPaymentsByTenant(req.user.id);

    const stats = await paymentModel.getTenantPaymentStats(req.user.id);

    res.json({
        success: true,
        payments,
        stats,
    });

};

const updatePayment = async (req, res) => {
    try {

        await paymentModel.updatePayment(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            message: "Payment updated successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const deletePayment = async (req, res) => {
    try {
        await paymentModel.deletePayment(req.params.id);

        res.json({
            success: true,
            message: "Payment deleted successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createPayment,
    getPayments,
    getMyPayments,
    updatePayment,
    deletePayment,
};