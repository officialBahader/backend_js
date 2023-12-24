const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const UserController = require('../controller/user');

router.post('/login', UserController.loginUser);
router.post('/all', UserController.getAllUsers);
router.post('/register', UserController.registerUser);
router.post('/profile', verifyToken, UserController.getUserProfile);
router.post('/updateProfile', verifyToken, UserController.updateUserProfile);
router.post('/deleteAccount', verifyToken, UserController.deleteUserAccount);

module.exports = router;
