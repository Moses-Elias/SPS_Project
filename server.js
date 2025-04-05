const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const subjectRoutes = require("./routes/subjectRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve frontend from public folder
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error: ", err));

// Use routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/protected"));
app.use("/api/subjects", require("./routes/subjectRoutes"));

// Log all registered routes
app._router.stack.forEach((route) => {
    if (route.route) {
        console.log(`Registered Route: ${route.route.path}`);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
