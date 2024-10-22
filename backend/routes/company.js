const express = require("express")
const router = express.Router();
const { Company, JobPosting, OtpModelPhone, OtpModelEmail } = require("../db");
const app = express();
const nodemailer =  require("nodemailer");
const MailerSend = require('mailersend');
const postmark = require("postmark");

require('dotenv').config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const { signupMiddleware, zodMiddleware, companyJwtMiddleware } = require("../middlewares/companyMiddleware")
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post( "/signup", zodMiddleware, signupMiddleware, async function (req, res){
    console.log(req.body);
    
    const {
        name,
        companyEmail,
        phoneNumber,
        companyName,
        employeeSize,
    } = req.body;
      try {
                    const obj = await Company.create(
                        {
                            name,
                            companyEmail,
                            phoneNumber,
                            companyName,
                            employeeSize,
                        }
                    )
                    const token = jwt.sign(
                        { id: obj._id, email: obj.companyEmail },
                        process.env.JWT_SECRET,
                        { expiresIn: '16h' }
                    );
                    
                    res.status(201).json({
                        message: 'company sign-up successful',
                        token,
                    });

      } catch (error) {
        console.error(error);
        
              return res.status(500).json({ message: 'Internal server error!!!' });
      }
}
)


function generateOtp() {
    let digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

router.post("/verifyPhone", async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const otp = generateOtp();
        await OtpModelPhone.updateOne(
            { phoneNumber },
            { 
                $set: { otp: otp }, 
                $setOnInsert: { otpCreatedAt: new Date() } 
            },
            { upsert: true }
        );

        await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: '+18019991529'
            ,to: phoneNumber,
        });

        return res.status(200).json({ message: "OTP sent successfully." });
    } catch (error) {
        if (error.code === 21211) { 
            console.error("Invalid phone number:", phoneNumber);
        } 
        res.status(500).json({ message: "failed to send OTP" });
        console.log(error);
        return;
    }
});

router.post("/verifyPhone2",companyJwtMiddleware,  async (req, res) => {
    const { enteredOtp, phoneNumber } = req.body;
    console.log(req.body);
    
    try {
        const otpRecord = await OtpModelPhone.findOne({ phoneNumber });
        if(!otpRecord){
            console.log("no no");
            
            return res.status(404).json({ message: "OTP expired" });
        }
        if(otpRecord.otp.toString() == enteredOtp ){
            

            res.status(200).json({ message: "OTP verified successfully" });
            await OtpModelPhone.deleteOne({ phoneNumber });
            const updateResult = await Company.updateOne(
                { phoneNumber: phoneNumber },
                { $set: { "isVerified.phoneNumber": true } }
            );

            console.log(updateResult);            
            return;
        }
        else {
            res.status(400).json({ message: "Invalid OTP. Please try again." });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
})



router.post("/verifyEmail",  
    async (req, res) => {
        const { companyEmail } = req.body;
    
        const otp = generateOtp();
        try {
            await sendEmail(companyEmail, otp);

            await OtpModelEmail.updateOne(
                { companyEmail },
                { $set: { otp, createdAt: new Date() } },
                { upsert: true }
            );
    
            return res.status(200).json({ message: "OTP sent to the provided email address." });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error in sending OTP." });
        }
    }    
 )

 router.post("/verifyEmail2", async (req, res) => {
    const { enteredOtp, companyEmail } = req.body;
    console.log(req.body);

    if (!enteredOtp || !companyEmail) {
        return res.status(400).json({ message: "OTP and company email are required." });
    }

    try {
        const otpRecord = await OtpModelEmail.findOne({ companyEmail });
        const email =companyEmail;
        if (!otpRecord) {
            return res.status(404).json({ message: "OTP expired or not found." });
        }
        
        if (otpRecord.otp.toString() === enteredOtp) {
            console.log("OTP is correct, proceeding with update");

            const companyRecord = await Company.findOne({ companyEmail: "ianuj4231@gmail.com" });
            console.log("Company Record Before Update:", companyRecord);

            const updateResult = await Company.updateOne(
                { companyEmail: email },
                { $set: { "isVerified.email": true } }
            );

            console.log("Update Result:", updateResult);

            if (updateResult.nModified === 0) {
                console.log("No document was updated.");
                return res.status(500).json({ message: "Failed to verify email." });
            }

            await OtpModelEmail.deleteOne({ companyEmail });

            return res.status(200).json({ message: "Email verified successfully." });
        } else {
            console.log("Invalid OTP entered");
            return res.status(400).json({ message: "Invalid OTP. Please try again." });
        }
    } catch (error) {
        console.error("Error during email verification:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});



router.post('/postJob', companyJwtMiddleware,   async (req, res) => {

    const { title, description, experienceLevel, endDate, candidateEmails } = req.body;
    console.log('Request Body:', req.body);
    console.log('Company ID:', req.company.id);
    
    try {

        const newJobPosting = await JobPosting.create({
            companyId: req.company.id, 
           title,
            description   ,
            experienceLevel,
            endDate,
            candidateEmails
        });

       console.log(newJobPosting);
       
        res.status(201).json({ jobPosting: newJobPosting });
    } catch (error) {
        console.error(error);
        res.status(500).json({  message: 'Server error' });
    }
});


router.get("/getAllCandidates",  companyJwtMiddleware ,  async (req, res, next) => {
                     
    const companyId = req.company.id;
    try {
                const obj = await JobPosting.findOne({companyId})
                const candidateEmails = obj.candidateEmails;
                return res.status(200).json({candidateEmails})
            } catch (error) {
                    console.log(error);
                return res.status(500).json({ message: 'Internal server error' });

    }
}   )

router.get("/getVerifiedStatus", companyJwtMiddleware, async function (req, res, next) {
    try {
        const company = await Company.findOne({ _id: req.company.id });
        console.log("company  is ", company);
        
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        const isVerified = company.isVerified;

        return res.status(200).json({ isVerified });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/acceptCandidate", companyJwtMiddleware, async (req, res, next) => {
    const { email } = req.body;
    try {
        await sendEmail2(email, 'accepted');
        return res.status(200).json({ message: `Candidate ${email} accepted` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error accepting candidate' });
    }
});

router.post("/rejectCandidate", companyJwtMiddleware, async (req, res, next) => {
    const { email } = req.body;
    try {
        await sendEmail2(email, 'rejected'); 
        return res.status(200).json({ message: `Candidate ${email} rejected` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error rejecting candidate' });
    }
});


async function sendEmail2(email, status) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: process.env.user, 
            pass: process.env.pass, 
        },
    });
    console.log("xxx");
    
    let subject, text;
    if (status === 'accepted') {
        subject = 'Congratulations, You Are Accepted!';
        text = `Dear ${email},\n\nWe are pleased to inform you that you have been accepted!\n\nBest regards,\nYour Company`;
    } else {
        subject = 'We Regret to Inform You';
        text = `Dear ${email},\n\nUnfortunately, you have not been selected at this time.\n\nBest regards,\nYour Company`;
    }

    await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: email,
        subject: subject,
        text: text 
    });
}

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.user, 
        pass: process.env.pass, 
    },
});

const sendEmail = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: '"User Service" <noreply@example.com>',
            to: email, 
            subject: 'OTP code', 
            text: `${otp}`, 
        });
        console.log('Message sent: ', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports= router;
