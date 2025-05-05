const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const router = express.Router();

// ========== Google OAuth Configuration ==========
passport.use(new GoogleStrategy({
    clientID: "448412099445-vtm3jtu3oc7dhm1p4fedq15edu3ab0l4.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            user = new User({
                username: profile.displayName,
                email: profile.emails[0].value,
                provider: "google",
                role: "student"
            });
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Required for session support (optional if using JWT)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));

// ========== Google OAuth Routes ==========
router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    const token = jwt.sign(
        {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.redirect(`http://localhost:5000/course.html?token=${token}`);
});

// ========== Manual Registration ==========
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: "Username already exists." });
        }

        const newUser = new User({
            username,
            email,
            password,
            provider: "local",
            role: "student"
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ token });
    } catch (err) {
        console.error("Register error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// ========== Manual Login ==========
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || user.provider !== "local" || user.password !== password) {
            return res.status(400).json({ msg: "Invalid credentials or unsupported login method." });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, user });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;