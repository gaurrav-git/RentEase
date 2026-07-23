const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Database Connection
require("./config/db");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const roomRoutes = require("./routes/roomRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const userRoutes = require("./routes/userRoutes");
const testRoutes = require("./routes/testRoutes"); // Keep this only if testRoutes.js exists

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes); // Remove this if you don't use test routes
app.use("/api/properties", propertyRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/users", userRoutes);

// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to RentEase API 🚀",
    });
});

module.exports = app;