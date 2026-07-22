const propertyModel = require("../models/propertyModel");

const createProperty = async (req, res) => {
    try {

        const propertyId = await propertyModel.createProperty({
            owner_id: req.user.id,
            ...req.body,
        });

        res.status(201).json({
            success: true,
            message: "Property created successfully",
            propertyId,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getProperties = async (req, res) => {

    const properties = await propertyModel.getPropertiesByOwner(req.user.id);

    res.json({
        success: true,
        data: properties,
    });

};

const updateProperty = async (req, res) => {

    const property = await propertyModel.getPropertyById(req.params.id);

    if (!property || property.owner_id !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "Access denied",
        });
    }

    await propertyModel.updateProperty(req.params.id, req.body);

    res.json({
        success: true,
        message: "Property updated",
    });

};

const deleteProperty = async (req, res) => {

    const property = await propertyModel.getPropertyById(req.params.id);

    if (!property || property.owner_id !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "Access denied",
        });
    }

    await propertyModel.deleteProperty(req.params.id);

    res.json({
        success: true,
        message: "Property deleted",
    });

};

module.exports = {
    createProperty,
    getProperties,
    updateProperty,
    deleteProperty,
};