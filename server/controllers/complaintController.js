const complaintModel = require("../models/complaintModel");

const createComplaint = async (req, res) => {

    const complaintId = await complaintModel.createComplaint(req.body);

    res.status(201).json({
        success: true,
        message: "Complaint created successfully",
        complaintId,
    });

};

const getComplaints = async (req, res) => {

    const complaints = await complaintModel.getComplaints();

    res.json({
        success: true,
        data: complaints,
    });

};

const updateComplaintStatus = async (req, res) => {

    const result = await complaintModel.updateComplaintStatus(
        req.params.id,
        req.body.status
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found",
        });
    }

    res.json({
        success: true,
        message: "Complaint updated",
    });

};

module.exports = {
    createComplaint,
    getComplaints,
    updateComplaintStatus,
};