const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const cookie = require('cookie');

// Model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password length should be 6 character long']
    },
    customerId: {
        type: String,
        default: "",
    },
    subscription: {
        type: String,
        default: ""
    }
})

// Hashed password
userSchema.pre('save', async function (next) {
    // update
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match password
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Sign Tokens
userSchema.methods.getSignedToken = function (res) {
    const accessToken = JWT.sign({ id: this._id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: process.env.JWT_ACCESS_EXPIREIN });
    const refreshToken = JWT.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN, { expiresIn: process.env.JWT_REFRESH_EXPIREIN });
    res.cookie("refreshToken", `${refreshToken}`, { maxAge: 86400 * 7000, httpOnly: true })
}

const User = mongoose.model('User', userSchema);

module.exports = User;