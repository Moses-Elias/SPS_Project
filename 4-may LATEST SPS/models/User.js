const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return this.provider === 'local';
        }
    },
    
    role: {
        type: String,
        default: 'student'
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
