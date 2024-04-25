const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemlate");

const OTPSChema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    },
});


//a function to send mail
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification Email", emailTemplate(otp));
        console.log("Email sent Successfully", mailResponse);
    }
    catch(error) {
        console.log("Error occured while sending mail: ",error);
        throw error;
    }
}

//PRE
OTPSChema.pre("save", async function(next) {
    console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
    next();
})
;

module.exports = mongoose.model("OTP",OTPSChema);