const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    subject: String,
    dueDate: Date,
    status: { type: String, enum: ["upcoming", "completed"], default: "upcoming" }
});

module.exports = mongoose.model("Assignment", assignmentSchema);
