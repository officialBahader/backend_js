const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthValidator = require('../validator/auth_validator');

const saltRounds = 10;

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        await AuthValidator.validateLoginRequest(req, res);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const accessToken = jwt.sign({ userId: user._id }, '1234567890');

        res.json({ user: user, accessToken: accessToken });
    } catch (error) {
        next(error);
    }
};

const registerUser = async (req, res, next) => {
    try {
        await AuthValidator.validateRegisterRequest(req, res);

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            age: req.body.age,
        });

        const token = jwt.sign({ userId: newUser._id }, '1234567890');

        res.json({ user: newUser, accessToken: token });
    } catch (error) {
        next(error);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        const newUser = await User.findById(req.userId);
        res.json({ user: newUser });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json({ users: users });
    } catch (error) {
        next(error);
    }
};

const updateUserProfile = async (req, res, next) => {
    try {
        const { username, age } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: { username, age } },
            { new: true }
        );
        res.json({ user: updatedUser });
    } catch (error) {
        next(error);
    }
};

const deleteUserAccount = async (req, res, next) => {
    try {
        await AuthValidator.validatePasswordRequest(req, res);

        const { password } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const updatedUser = await User.findByIdAndDelete(req.userId);
        res.json({
            user: updatedUser,
            message: 'User account deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginUser,
    getAllUsers,
    registerUser,
    getUserProfile,
    deleteUserAccount,
    updateUserProfile,
};
