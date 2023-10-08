const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Registration
router.post('/register', companyController.registerCompany);

// Login
router.post('/login', companyController.loginCompany);

// Forgot Password
router.post('/forgotPassword', companyController.forgotPasswordCompany);

// Reset Password
router.post('/resetPassword/:token', companyController.resetPasswordCompany);

module.exports = router;
