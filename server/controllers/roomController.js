const roomModel = require("../models/roomModel");
const propertyModel = require("../models/propertyModel");

const createRoom = async (req, res) => {
    try {

        const property = await propertyModel.getPropertyById(req.body.property_id);

        if (!property || property.owner_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const roomId = await roomModel.createRoom(req.body);

        res.status(201).json({
            success: true,
            message: "Room created successfully",
            roomId,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getRooms = async (req, res) => {

    const rooms = await roomModel.getRoomsByProperty(req.params.propertyId);

    res.json({
        success: true,
        data: rooms,
    });

};

const updateRoom = async (req, res) => {

    await roomModel.updateRoom(req.params.id, req.body);

    res.json({
        success: true,
        message: "Room updated",
    });

};

const deleteRoom = async (req, res) => {

    await roomModel.deleteRoom(req.params.id);

    res.json({
        success: true,
        message: "Room deleted",
    });

};

module.exports = {
    createRoom,
    getRooms,
    updateRoom,
    deleteRoom,
};