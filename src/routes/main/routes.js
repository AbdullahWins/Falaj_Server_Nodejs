const express = require("express");
const router = express.Router();

// Import routes
const adminRoutes = require("../adminRoutes");
const ownerRoutes = require("../ownerRoutes");
const userRoutes = require("../userRoutes");
const stripeRoutes = require("../stripeRoutes");

// Routes
router.use(adminRoutes);
router.use(ownerRoutes);
router.use(userRoutes);
router.use(stripeRoutes);

module.exports = router;
