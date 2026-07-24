const paymentModel = require("../models/paymentModel");

const createPayment = async (req, res) => {
    try {
        console.log("Payment Body:", req.body);

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