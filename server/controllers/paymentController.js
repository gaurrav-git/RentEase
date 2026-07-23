const paymentModel = require("../models/paymentModel");

const createPayment = async (req, res) => {

    const paymentId = await paymentModel.createPayment(req.body);

    res.status(201).json({
        success: true,
        message: "Payment recorded successfully",
        paymentId,
    });

};

const getPayments = async (req, res) => {

    const payments = await paymentModel.getPayments();

    res.json({
        success: true,
        data: payments,
    });

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

module.exports = {
    createPayment,
    getPayments,
    getMyPayments,
};