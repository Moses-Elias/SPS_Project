
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password"); // exclude password
        if (!req.user) return res.status(404).json({ msg: "User not found" });
        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};

// Protected route: Get current user info
router.get("/user", authMiddleware, (req, res) => {
    res.json({
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
    });
});

module.exports = router;
