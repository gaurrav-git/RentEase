const dashboardModel = require("../models/dashboardModel");

const getDashboard = async (req, res) => {

    const stats = await dashboardModel.getDashboardStats();

    res.json({
        success: true,
        data: stats,
    });

};

module.exports = {
    getDashboard,
};