const express = require("express");
const router = express.Router();

// Import routes
const adminRoutes = require("../adminRoutes");
const ownerRoutes = require("../ownerRoutes");
const userRoutes = require("../userRoutes");

// Routes
router.use(adminRoutes);
router.use(ownerRoutes);
router.use(userRoutes);

module.exports = router;
