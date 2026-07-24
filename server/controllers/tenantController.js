const bcrypt = require("bcrypt");
const db = require("../config/db");
const tenantModel = require("../models/tenantModel");


const createTenant = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            room_id,
            phone,
            aadhaar,
            occupation,
            joining_date,
            security_deposit,
        } = req.body;

        // Check room capacity
const [room] = await db.execute(
    `
    SELECT
        r.capacity,
        r.occupied
    FROM rooms r
    JOIN properties p
        ON r.property_id = p.id
    WHERE r.id = ?
    AND p.owner_id = ?
    `,
    [room_id, req.user.id]
);

if (room.length === 0) {
    return res.status(404).json({
        success: false,
        message: "Room not found",
    });
}

if (room[0].occupied >= room[0].capacity) {
    return res.status(400).json({
        success: false,
        message: "Room is already full",
    });
}

        // Check if email already exists
        const [existing] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const [userResult] = await db.execute(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, 'TENANT')`,
            [name, email, hashedPassword]
        );

        const userId = userResult.insertId;

        // Create tenant profile
        await tenantModel.createTenant(userId, {
            room_id,
            phone,
            aadhaar,
            occupation,
            joining_date,
            security_deposit,
        });

        // Increase occupied count
        await db.execute(
            `UPDATE rooms
             SET occupied = occupied + 1
             WHERE id = ?`,
            [room_id]
        );

        res.status(201).json({
            success: true,
            message: "Tenant created successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getTenants = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const tenants = await tenantModel.getAllTenants(ownerId);

        res.json({
            success: true,
            data: tenants,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getTenantDashboard = async (req, res) => {
    try {

        const dashboard = await tenantModel.getTenantDashboard(req.user.id);

        if (!dashboard) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found",
            });
        }

        res.json({
            success: true,
            data: dashboard,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};

const updateTenant = async (req, res) => {
    try {
        console.log("Update Request:", req.body);

        await tenantModel.updateTenant(req.params.id, req.body);

        res.json({
            success: true,
            message: "Tenant updated successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteTenant = async (req, res) => {
    try {
        await tenantModel.deleteTenant(req.params.id);

        res.json({
            success: true,
            message: "Tenant deleted successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createTenant,
    getTenants,
    updateTenant,
    deleteTenant,
    getTenantDashboard,
};