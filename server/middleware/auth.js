const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//Auth
exports.auth = async (req,res, next) => {
    try{
        //extract token
        const token = req.cookies.token || req.body.token || (req.header("Authorization") && req.header("Authorization").replace("Bearer ",""));
        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token is Missing',
        });
        }

        //verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token", decode);
            req.user = decode;
        }
        catch(error) {
            //verification - issues
            return res.status(401).json({
                success:false,
                message:'Token is invalid',
        });
        }
        next();
    }
    catch(error) {
        console.log(error);
        return res.status(401).json({
            success:false,
            message:'something went wrong while validating token',
        });
    }
}

//isStudent
exports.isStudent = async (req,res, next) => {
    try{
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for student only',
            });
        }
        next();
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'User role cannot be identified, Please try again later',
        });
    }
}

//isInstructor
exports.isInstructor = async (req,res, next) => {
    try{
        if(req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructor only',
            });
        }
        next();
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'User role cannot be identified, Please try again later',
        });
    }
}

//isAdmin
exports.isAdmin = async (req,res, next) => {
    try{
        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin only',
            });
        }
        next();
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'User role cannot be identified, Please try again later',
        });
    }
}