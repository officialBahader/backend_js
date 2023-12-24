const { body, validationResult } = require('express-validator');


const validateLoginRequest = async (req, res) => {
    await body('email').isEmail().normalizeEmail().withMessage('Email is required').run(req);
    await body('password').notEmpty().withMessage('Password is required').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, error: errors.array()[0].msg });
    }
};

const validateRegisterRequest = async (req, res) => {
    await body('email').isEmail().normalizeEmail().withMessage('Email is required').run(req);
    await body('password').isLength({ min: 6 }).withMessage('Password is required').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, error: errors.array()[0].msg });
    }
};

const validateForgotRequest = async (req, res) => {
    await body("oldPassword").isLength({ min: 6 }).withMessage('Password is required').run(req);
    await body("newPassword").isLength({ min: 6 }).withMessage('New Password is required').run(req);
    await body('userId').notEmpty().withMessage('User Id is required').run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, error: errors.array()[0].msg });
    }

}
const validatePasswordRequest = async (req, res) => {
    await body("password").isLength({ min: 6 }).withMessage('Password is required').run(req);
    await body('userId').notEmpty().withMessage('User Id is required').run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, error: errors.array()[0].msg });
    }

}
module.exports = {
    validateLoginRequest,
    validateRegisterRequest,
    validateForgotRequest,
    validatePasswordRequest,
};