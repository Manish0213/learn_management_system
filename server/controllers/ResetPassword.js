const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//RESET PASSWORD
exports.resetPasswordToken = async (req, res) => {
    try{
        //get email from req body
        const email = req.body.email;
        //check user for this email, email verification
        const user = await User.findOne({email: email});
        if(!user) {
            return res.json({
                success:false,
                message:'Your Email is not Registered with us',
            });
        }
        //generate token
        const token = crypto.randomBytes(20).toString("hex");
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                        {email:email},
                                        {
                                            token:token,
                                            resetPasswordExpires: Date.now() + 5*60*1000,
                                        },
                                        {new:true});
        //create url
        const url = `http://localhost:3000/update-password/${token}`;
        //send mail containing the url
        await mailSender(email,
                        "Password Reset Link",
                        `Reset password Here: ${url} `);
        //return response
        return res.json({
            success:true,
            message:'Email sent successfully, please check email and change password',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset password link',
        })
    }
}

//reset password
exports.resetPassword = async (req,res) => {
    try{
        //data fetch
        const {password, confirmPassword, token} = req.body;
        //validation
        if(password !== confirmPassword) {
            return res.json({
                success:false,
                message:'Password is not matching. Please enter same password in both fields',
            });
        }
        //get userdetails from db using token
        const userDetails = await User.findOne({token: token});
        //if no entry - token invalid
        if(!userDetails) {
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }
        //token time check
        if( userDetails.resestPasswordExpires < Date.now()) {
            return res.json({
                success:false,
                message:'Token is expired, please generate a new token',
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //password update
        await User.findOneAndUpdate({token: token},
                                    {password:hashedPassword},
                                    {new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:'Your Password has been Reset',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Error while password reset, please try again later',
        });
    }
}   