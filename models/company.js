const mongoose = require('mongoose');
const { default: isEmail } = require('validator');
const bcrypt = require('bcrypt');

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    contact: {
        type: String, // Changed type to String for flexibility (e.g., including country code)
        required: true,
        validate: {
            validator: (value) => /^\d{10}$/.test(value), // Validate contact number format (10 digits)
            message: 'Invalid contact number format'
        }
    },
    password: {
        type: String,
        required: true,
        select: false // Make sure password is not selected by default
    },
    coFounders: [{
        name: {
            type: String,
            required: true
        },
        contactNumber: {
            type: String,
            required: true,
            validate: {
                validator: (value) => /^\d{10}$/.test(value),
                message: 'Invalid contact number format'
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: isEmail
        },
    }],
    companyProfile: {
        numberOfProfiles: {
            type: Number,
            required: true
        },
        profileDetails: [{
            profileName: {
                type: String,
                required: true
            },
            period: {
                startDate: Date,
                endDate: Date
            },
            kindOfProfile: {
                type: String
            },
            aboutCompany: {
                type: String,
                required: true
            },
            profileDescription: {
                type: String,
                required: true
            },
            pay: {
                type: Number,
                required: true
            },
            testDate: Date,
            modeOfTest: String,
            profileLocation: {
                type: String,
                required: true
            },
            openedBranches: [String]
        }]
    }
});

// Hash password before saving
companySchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
