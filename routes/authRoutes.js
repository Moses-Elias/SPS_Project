const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Import User model

const router = express.Router();

// Register route (Sign Up)
router.post('/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ msg: 'Username or Email already exists' });
        }

        // Create new user
        const newUser = new User({ username, email, password });

        // Save user (password will be hashed automatically thanks to the pre-save hook in the model)
        await newUser.save();

        res.status(201).json({ msg: 'User created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Login route
router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });  // Username not found
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });  // Incorrect password
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,  // Ensure JWT_SECRET is in .env file
            { expiresIn: '1h' }
        );

        // Respond with the token
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
