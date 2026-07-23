const noticeModel = require("../models/noticeModel");

const createNotice = async (req, res) => {
    try {

        await noticeModel.createNotice(
            req.body,
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: "Notice published successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};

const getNotices = async (req, res) => {
    try {

        const notices = await noticeModel.getAllNotices();

        res.json({
            success: true,
            data: notices,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};

const deleteNotice = async (req, res) => {
    try {

        await noticeModel.deleteNotice(req.params.id);

        res.json({
            success: true,
            message: "Notice deleted successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};

module.exports = {
    createNotice,
    getNotices,
    deleteNotice,
};