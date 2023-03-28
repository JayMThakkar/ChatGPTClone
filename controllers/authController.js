const User = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");

// JWT token
exports.sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken(res);
    res.status(statusCode).json({
        success: true,
        token,
    })
}

// Register 
exports.registerController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // Existing user
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return next(new errorResponse('Email is already registered', 500))
        }
        const user = await User.create({ username, email, password });
        this.sendToken(user, 201, res);

    } catch (error) {
        console.log(error);
        next(error)
    }
}

exports.loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            return next(new errorResponse('Please provide email or password', 401))
        }
        const user = await User.findOne({ email });
        if (!user) {
            return next(new errorResponse('Invalid Credential', 401))
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new errorResponse('Invalid Credential', 401))
        }
        // res
        this.sendToken(user, 200, res);
    } catch (error) {
        console.log(error);
        next(error)
    }
}

// Logout
exports.logoutController = async (req, res) => {
    res.clearCookie('refreshToken');
    return res.status(200).json({
        success: true,
        message: 'Logout Successfully'
    });
}