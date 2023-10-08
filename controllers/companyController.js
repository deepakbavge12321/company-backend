const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/company'); 
const { sendCompanyForgotPasswordEmail } = require('./email.js');

exports.registerCompany = async (req, res) => {
    try {
        const { companyName, contact, password, coFounders, companyProfile } = req.body;
        const companyExists = await Company.findOne({ companyName });
        
        if (companyExists) {
            return res.status(400).json({ error: 'Company with this name already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 15);
        const company = new Company({ companyName, contact, password: hashedPassword, coFounders, companyProfile });
        
        await company.save();

        res.status(201).json({ message: 'Company registered successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Company registration failed' });
    }
};

exports.loginCompany = async (req, res) => {
    try {
        const { companyName, password } = req.body;
        const company = await Company.findOne({ companyName });

        if (!company) {
            return res.status(401).json({ error: 'Authentication failed, no company found' });
        }

        const isPasswordValid = await bcrypt.compare(password, company.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid Password' });
        }

        const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1 hr 
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Authentication failed JWT' });
    }
};

exports.forgotPasswordCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        const company = await Company.findOne({ companyName });

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        company.resetPasswordToken = resetToken;
        company.resetPasswordExpires = new Date(Date.now() + 1800000); // 30 minutes

        await company.save();

        await sendCompanyForgotPasswordEmail(company.coFounders[0].email, resetToken);

        return res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Password reset failed' });
    }
};

exports.resetPasswordCompany = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const company = await Company.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!company) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        company.password = await bcrypt.hash(newPassword, 10);
        company.resetPasswordToken = undefined;
        company.resetPasswordExpires = undefined;

        await company.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Password reset failed' });
    }
};

