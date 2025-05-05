const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");

// =====Routes =====
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protected");
const subjectRoutes = require("./routes/subjectRoutes");
const enrollRoutes = require("./routes/enrollRoutes");
const userRoutes = require('./routes/userRoutes');
const gradesRoutes = require("./routes/gradesRoutes");
const assignmentsRoutes = require("./routes/assignmentsRoutes");
const calendarRoutes = require("./routes/calendarRoutes");

dotenv.config();
const app = express();

// ===== Passport Config =====
require("./config/passport")(passport); // we'll create this config file below

// ===== Middleware =====
app.use(express.json());
app.use(cors());

// Serve static frontend files (HTML, CSS, JS) from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Express session (required for passport)
app.use(session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static frontend files (HTML, CSS, JS) from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api", enrollRoutes);
app.use('/api/user', userRoutes);
app.use("/api/grades", gradesRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/calendar", calendarRoutes);


// Fallback route (for frontend navigation)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "LoginPage.html"));
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
