const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subject: String,
    score: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Grade", gradeSchema);
