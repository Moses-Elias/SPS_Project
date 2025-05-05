const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    date: Date
});

module.exports = mongoose.model("CalendarEvent", eventSchema);
