const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const roomRoutes = require("./routes/roomRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/rent-payments", paymentRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to RentEase API 🚀",
    });
});

module.exports = app;