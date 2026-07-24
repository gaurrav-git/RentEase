const complaintModel = require("../models/complaintModel");

const tenantModel = require("../models/tenantModel");

const createComplaint = async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        const tenant = await tenantModel.getTenantByUserId(req.user.id);

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found",
            });
        }

        const complaintId = await complaintModel.createComplaint({
            tenant_id: req.user.id,
            room_id: tenant.room_id,
            title,
            description,
            priority,
        });

        res.status(201).json({
            success: true,
            message: "Complaint created successfully",
            complaintId,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getComplaints = async (req, res) => {

    const complaints = await complaintModel.getComplaints();
    const stats = await complaintModel.getComplaintStats();
    res.json({
        success: true,
        data: complaints,
        stats,
    });

};

const updateComplaintStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await complaintModel.updateComplaintStatus(
        id,
        status
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found",
        });
    }

    res.json({
        success: true,
        message: "Complaint updated successfully",
    });

};

const getMyComplaints = async (req, res) => {
    try {
        const complaints =
            await complaintModel.getComplaintsByTenant(req.user.id);

        const stats =
            await complaintModel.getTenantComplaintStats(req.user.id);

        res.json({
            success: true,
            complaints,
            stats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    updateComplaintStatus,
    getMyComplaints,
};