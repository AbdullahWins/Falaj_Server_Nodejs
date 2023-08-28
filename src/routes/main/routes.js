const express = require("express");
const router = express.Router();

// Import routes
const adminRoutes = require("../adminRoutes");
const userRoutes = require("../userRoutes");
const stripeRoutes = require("../stripeRoutes");

// Routes
router.use(adminRoutes);
router.use(userRoutes);
router.use(stripeRoutes);

module.exports = router;
