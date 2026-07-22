const tenantModel = require("../models/tenantModel");

const getTenants = async (req, res) => {
    const tenants = await tenantModel.getAllTenants();

    res.json({
        success: true,
        data: tenants,
    });
};

const assignRoom = async (req, res) => {

    const { tenantId, roomId } = req.body;

    const result = await tenantModel.assignRoom(
        tenantId,
        roomId
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: "Tenant not found",
        });
    }

    res.json({
        success: true,
        message: "Room assigned successfully",
    });

};

module.exports = {
    getTenants,
    assignRoom,
};