const dashboardModel = require("../models/dashboardModel");

const getDashboard = async (req, res) => {

    const ownerId = req.user.id;
    const stats = await dashboardModel.getDashboardStats(ownerId);

    res.json({
        success: true,
        data: stats,
    });

};

module.exports = {
    getDashboard,
};