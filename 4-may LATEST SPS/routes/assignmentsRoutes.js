const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");
const authenticate = require("../middleware/authenticate");

// Get assignments for logged-in user
router.get("/", authenticate, async (req, res) => {
    try {
        const assignments = await Assignment.find({ student: req.user.id });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching assignments" });
    }
});

module.exports = router;
