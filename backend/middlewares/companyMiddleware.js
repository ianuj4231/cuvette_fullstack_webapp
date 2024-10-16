
require('dotenv').config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { User, Company } = require("../db");

const zod = require("zod");
const comapnyemailschema = zod.string().email({ message: "Invalid email address" });

async function zodMiddleware(req, res, next) {
    const { companyEmail } = req.body;
    console.log("Company Email:", companyEmail);
    
    try {
        const result = comapnyemailschema.safeParse(companyEmail);
        if (result.success) {
            console.log("Validation success");
            next();
        } else {
            console.log("Validation failed", result.error);
            return res.status(400).json({ message: "Invalid email format" });
        }
    } catch (error) {
        console.error("Middleware error:", error);
        return res.status(500).json({ message: "Internal server error!!" });
    }
}
async function signupMiddleware (req, res, next) {
      try {
        const obj = await Company.findOne({ companyEmail: req.body.companyEmail });
        if(obj){
            res.status(401).json({
                message: "company with that email already exists. Please try to sign-in instead."
            })
            return;
        }
        next();
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        return;
      }
}


async function companyJwtMiddleware(req, res, next) {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        console.log("xxtoken");
            console.log("token in here is ", token);
            
        if (!token) {
            return res.status(401).json({ message: "No token sent from frontend or logged out" });
        }

        const verified = jwt.verify(token, JWT_SECRET);
        console.log("verified ", verified);

        if (verified) {
            req.company = verified;
            console.log("req.company ", req.company);
            next();
        } else {
            return res.status(403).json({ message: "Not authorized to access this API or logged out"});
        }
    } catch (error) {
        console.error("Error in customerJwtMiddleware: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports={companyJwtMiddleware, signupMiddleware, zodMiddleware }