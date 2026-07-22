const db = require("../config/db");

const createProperty = async (propertyData) => {
    const [result] = await db.execute(
        `INSERT INTO properties
        (owner_id, name, address, city, state, pincode)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            propertyData.owner_id,
            propertyData.name,
            propertyData.address,
            propertyData.city,
            propertyData.state,
            propertyData.pincode,
        ]
    );

    return result.insertId;
};

const getPropertiesByOwner = async (ownerId) => {
    const [rows] = await db.execute(
        "SELECT * FROM properties WHERE owner_id = ?",
        [ownerId]
    );

    return rows;
};

const getPropertyById = async (id) => {
    const [rows] = await db.execute(
        "SELECT * FROM properties WHERE id = ?",
        [id]
    );

    return rows[0];
};

const updateProperty = async (id, propertyData) => {
    await db.execute(
        `UPDATE properties
        SET name=?, address=?, city=?, state=?, pincode=?
        WHERE id=?`,
        [
            propertyData.name,
            propertyData.address,
            propertyData.city,
            propertyData.state,
            propertyData.pincode,
            id,
        ]
    );
};

const deleteProperty = async (id) => {
    await db.execute(
        "DELETE FROM properties WHERE id=?",
        [id]
    );
};

module.exports = {
    createProperty,
    getPropertiesByOwner,
    getPropertyById,
    updateProperty,
    deleteProperty,
};