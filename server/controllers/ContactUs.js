const { contactForm } = require("../mail/templates/contactForm");
const mailSender = require("../utils/mailSender");

exports.contactUsController = async(req,res) => {
    const {email, firstname, lastname,message, phonenumber, country} = req.body;
    console.log(req.body)
    try {
        const emailresponse = await mailSender(
            email,
            "Your Data send successfully",
            contactForm(email, firstname, lastname,message, phonenumber, country)
        )
        console.log("Email res", emailresponse)
        return res.json({
            success: true,
            message: "Email send successfully",
        })
    } catch (error) {
        console.log("Error", error)
    console.log("Error message :", error.message)

    return res.json({
      success: false,
      message: "Something went wrong...",
    })
    }
}