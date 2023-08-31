const express = require("express");
const router = express.Router();

// Import routes
const adminRoutes = require("../adminRoutes");
const ownerRoutes = require("../ownerRoutes");
const userRoutes = require("../userRoutes");
const falajRoutes = require("../falajRoutes");

// Routes
router.use(adminRoutes);
router.use(ownerRoutes);
router.use(userRoutes);
router.use(falajRoutes);

module.exports = router;
