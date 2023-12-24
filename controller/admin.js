var Admin = require('../models/admin');
var AuthValidator = require("../validator/auth_validator");
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin controller definition

const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        await AuthValidator.validateLoginRequest(req, res);
        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const accessToken = jwt.sign({ userId: user._id }, "1234567890");
        res.json({ user: user, accessToken: accessToken });
    } catch (error) {
        next(error);
    }
}

const adminRegister = async (req, res, next) => {
    try {
        await AuthValidator.validateRegisterRequest(req, res);
        const hashedPassword = await bcrypt.hash(req.body.password,
            saltRounds);
        const newUser = await Admin.create({
            email: req.body.email,
            password: hashedPassword,
        });
        const token = jwt.sign({ userId: newUser._id },
            '1234567890');
        res.json({ user: newUser, accessToken: token });
    } catch (error) {
        next(error);
    }
}

const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;
    try {
        await AuthValidator.validateForgotRequest(req, res);
        const user = await Admin.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    adminLogin,
    adminRegister,
    changePassword,
};
