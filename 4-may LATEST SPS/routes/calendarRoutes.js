const express = require("express");
const router = express.Router();
const CalendarEvent = require("../models/CalendarEvent");
const authenticate = require("../middleware/authenticate");

// Get upcoming events
router.get("/", authenticate, async (req, res) => {
    try {
        const events = await CalendarEvent.find({ student: req.user.id });
        res.json(events);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching calendar events" });
    }
});

module.exports = router;
