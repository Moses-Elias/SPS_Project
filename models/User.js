const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Import bcryptjs for password hashing

// Define User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Store hashed password
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  // Only hash if the password is new or modified

    try {
        const salt = await bcrypt.genSalt(10);  // Generate salt
        this.password = await bcrypt.hash(this.password, salt);  // Hash the password
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);  // Compare entered password with the stored hashed password
};

const User = mongoose.model('User', userSchema);

module.exports = User;