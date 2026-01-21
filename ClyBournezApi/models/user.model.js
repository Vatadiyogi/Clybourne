const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    phone: String,
    lastSignIn: Date,
    verified: {
        type: Boolean,
        default: false
    },
    creationTime: {
        type: Date,
        default: Date.now
    },
    accessToken: String,
    refreshToken: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    adminPassword: {
        type: String,
        required: function () {
            return this.isAdmin;
        }
    },
    role: {
        type: String,
        default: 'User' // Default role is User
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
