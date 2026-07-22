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

module.exports = {
    createPayment,
    getPayments,
};