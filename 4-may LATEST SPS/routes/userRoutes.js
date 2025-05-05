const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth"); // Assuming your auth middleware is in "../middleware/auth.js"
const User = require("../models/User");
const Subject = require("../models/Subject");

// Route to get user profile information (example)
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password for security
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});

// Route to enroll a user in a subject
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

        // Save the user
        await user.save();

        res.status(200).json({ msg: "Subject enrolled successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});

// Route to get the enrolled subjects for the authenticated user
router.get("/subjects", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('subjects');

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // The 'subjects' field in the User model should be populated with the actual Subject documents
        res.json(user.subjects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while fetching enrolled subjects" });
    }
});

// Optional: Route to remove a user from a subject
router.delete("/unenroll/:subjectId", authMiddleware, async (req, res) => {
    const { subjectId } = req.params;

    try {
        const user = await User.findById(req.user.id);

        // Check if the subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ msg: "Subject not found" });
        }

        // Check if the user is enrolled in the subject
        if (!user.subjects.includes(subjectId)) {
            return res.status(400).json({ msg: "Not enrolled in this subject" });
        }

        // Remove the subject from the user's subjects list
        user.subjects = user.subjects.filter(
            (subject) => subject.toString() !== subjectId
        );

        // Save the user
        await user.save();

        res.json({ msg: "Subject unenrolled successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;