const express = require("express");
const Subject = require("../models/Subject"); 
const router = express.Router();

// GET all subjects
router.get("/", async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: "Server error while fetching subjects" });
    }
});

// GET a single subject by ID
router.get("/:id", async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        res.json(subject);
    } catch (err) {
        res.status(500).json({ error: "Error fetching subject" });
    }
});

// POST a new subject
router.post("/", async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingSubject = await Subject.findOne({ name });
        if (existingSubject) {
            return res.status(400).json({ error: "Subject already exists" });
        }

        const newSubject = new Subject({ name, description });
        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (err) {
        res.status(500).json({ error: "Server error while creating subject" });
    }
});

// UPDATE a subject
router.put("/:id", async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!updatedSubject) {
            return res.status(404).json({ error: "Subject not found" });
        }

        res.json(updatedSubject);
    } catch (err) {
        res.status(500).json({ error: "Error updating subject" });
    }
});

// DELETE a subject
router.delete("/:id", async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
        if (!deletedSubject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        res.json({ message: "Subject deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting subject" });
    }
});

// SEARCH subjects by name
router.get("/search/:name", async (req, res) => {
    try {
        const subjects = await Subject.find({ name: new RegExp(req.params.name, "i") });
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: "Error searching subjects" });
    }
});

module.exports = router;
