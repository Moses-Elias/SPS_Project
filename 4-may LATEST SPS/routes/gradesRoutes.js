const express = require("express");
const router = express.Router();
const Grade = require("../models/Grade");
const authenticate = require("../middleware/authenticate");

// Get grades for logged-in user
router.get("/", authenticate, async (req, res) => {
    try {
        const grades = await Grade.find({ student: req.user.id });
        res.json(grades);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching grades" });
    }
});

module.exports = router;
