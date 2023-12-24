const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const adminController = require('../controller/admin');

// Admin route definition

router.post('/admin/login', adminController.adminLogin);
router.post('/admin/register', adminController.adminRegister);
router.post('/admin/changePassword', adminController.changePassword);

module.exports = router;
