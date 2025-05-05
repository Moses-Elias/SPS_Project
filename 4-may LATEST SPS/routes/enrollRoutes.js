const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Subject = require("../models/Subject");

router.post("/enroll", authMiddleware, async (req, res) => {
    const { subjectId } = req.body;

    try {
        // Check if the subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ msg: "Subject not found" });
        }

        const user = await User.findById(req.user.id);

        // Check if the user is already enrolled in the subject
        if (user.subjects.includes(subjectId)) {
            return res.status(400).json({ msg: "Already enrolled in this subject" });
        }

        // Add subject to the user's subjects list
        user.subjects.push(subjectId);

        // Save the user only if the list was modified
        await user.save();

        res.status(200).json({ msg: "Subject enrolled successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
