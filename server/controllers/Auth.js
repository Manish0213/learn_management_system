const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const { response } = require("express");


//send OTP
exports.sendOTP = async (req,res) => {
    try{
        //fetch email from request body
        const {email} = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email});

        //if user already exist return response
        if(checkUserPresent) {
            return res.status(401).json({
                success:false,
                message:'User already Registered',
            })
        }

        //Generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP Generated: ", otp);

        //check unique otp
        const result = await OTP.findOne({otp: otp});

        while(result) {
            otp = otpGenerator(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        //create an entry for otp in DB
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body:", otpBody);

        //return response successful
        res.status(200).json({
            success:true,
            message:'OTP Sent Successfully',
            otp,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};


//SIGNUP
exports.signUp = async (req,res) => {
    try{
        //data fetch from reqeust body
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        //vallidate karlo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

        //check if passwords are matching
        if(password !== confirmPassword) {
            return res.status(400).json({
                success:false,
                message:'Password and confirmPasssword value does not match, please try again',
            });
        }

        //check if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success:false,
                message:'User is already registered',
            });
        }

        //find most recent otp stored for the user
        const response = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log("recent otp:", response);
        //validate otp
        if(response.length === 0) {
            //OTP not found
            return res.status(400).json({
                success:false,
                message:'OTP not Found',
            })
        } else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create entry in Db
        const profileDetails = await Profile.create({
            gender:null,
            dayeOfBirth:null,
            about:null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,          
            additionalDetails:profileDetails._id,
            images: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`, 
            })

            // return response
            return  res.status(200).json({
                success:true,
                message:'User is registered successfully',
                user,
            });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again",
        })
    }
};


//LOGIN
exports.login = async (req,res) => {
    try{
        //get data from the body
        const {email, password} = req.body;
        //validate data
        if(!email || !password) {
            return res.status(403).json({
                success:false,
                message:'All fiels are required, please try again',
            });
        }

        //user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user) {
            return res.status(401).json({
                success:false,
                message:'User is not registered, please signup first',
            });
        }
        
        //generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true, 

            }
            res.cookie("token", token , options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in successfully',
            })
        }
        else {
            return res.status(401).json({
                success:false,
                message:'Password is Incorrect',
            });
        }
        
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'login Failure, please try again later',
        });
    }
};

//change password
exports.changePassword = async(req, res) => {
    try{
        //Get user data from req.user
        const userDetails = await User.findById(req.user.id);
        //get oldpass , newpass and cnfnewpass
        const {oldPassword, newPassword, confirmNewPassword} = req.body;

        //validation
        if(!oldPassword || !newPassword ) {
            return res.status(401).json({
                success:false,
                message:'All fields are mandatory',
            });
        }
        
        //validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
            );
        if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:'The password is incorrect',
            });
        }
        //match new password and confirm new password
        // if(newPassword !== confirmNewPassword) {
        //     return res.status(400).json({
        //         success:false,
        //         message:'Password and confirm Password is not matching. Please enter same password in both fields',
        //     });
        // }

        //update the password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        //update pass in DB
        const updatedUserDetails = await User.findByIdAndUpdate( 
            req.user.id, 
            {password: encryptedPassword}, 
            {new:true});
        
        //send mail - Password updated
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password Change",
                passwordUpdated(
                    updatedUserDetails.email, updatedUserDetails.firstName
                    // `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                ),
            );
            console.log("Email sent successfully", emailResponse);
        } catch (error) {
            console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
        }
    
        //return response
        return res.status(200).json({
            success:true,
            message:'Password changed successfully',
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while changing the password. Please try again later',
        });
    }
}