const mongoose = require('mongoose');
require('dotenv').config();
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL);

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    companyEmail: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true }, 
    isVerified: {
        email: { type: Boolean, default: false },
        phoneNumber: { type: Boolean, default: false },
    },
    companyName: { type: String, required: true },
    employeeSize: { type: Number, required: true }, 
    jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting' }],
}); 

const Company = mongoose.model('Company', companySchema);

const jobPostingSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    endDate: { type: Date, required: true },
    candidateEmails: [{ type: String }]
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

const OtpSchemaPhone = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true }, 
    otp: { type: String, required: true },
    created_at_time: { type: Date, expires: '5m', default: Date.now }
});

const OtpModelPhone = mongoose.model("OTPPhone", OtpSchemaPhone);

const OtpSchemaEmail = new mongoose.Schema({
    companyEmail : { type: String, required: true, unique: true }, 
    otp: { type: String, required: true },
    created_at_time: { type: Date, expires: '5m', default: Date.now }
});

const OtpModelEmail = mongoose.model("OTPEmail", OtpSchemaEmail);

module.exports = { Company, OtpModelPhone,  OtpModelEmail , JobPosting };