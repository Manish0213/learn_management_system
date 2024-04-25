const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessfullEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

//initiate the Razorpay order
exports.capturePayment = async(req, res) => {
        const {courses} = req.body;
        const userId = req.user.id;

        if(courses.length === 0) {
            return res.json({success:false, message:"Please provide courseId"})
        }

        let totalAmount = 0;
        for(const course_id of courses) {
            let course;
            try {
                course = await Course.findById(course_id)
                if(!course) {
                    return res.status(200).json({success:false, message:"could not find the course"})
                }

                const uid = new mongoose.Types.ObjectId(userId);
                if(course.studentsEnrolled.includes(uid)) {
                    return res.status(200).json({success:false, message:"student is already enrolled"})
                }

                totalAmount += course.price
            } catch (error) {
                console.log(error)
                return res.status(500).json({success:false, message:error.message})
            }
        }

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: Math.random(Date.now()).toString(),
        }

        try {
            const paymentResponse = await instance.orders.create(options)
            res.json({
                success: true,
                message:paymentResponse
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({success:false, message:"could not initiate the order"})
        }
}

//verify payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex")

        if(expectedSignature === razorpay_signature) {
            //enroll student
            await enrolledStudents(courses, userId, res)
            //return res
            return res.status(200).json({success:true, message:"Payment Verified"});
        }
        return res.status(200).json({success:false, message:"Payment Failed"});
}

const enrolledStudents = async(courses, userId, res) => {
    if(!courses || !userId ) {
        return res.status(400).json({success:false, message:"Please provide data for courseId and userId"});
    }

    for(const courseId of courses) {
       try {
         //find the course and enroll the student in it
         const enrolledCourse = await Course.findByIdAndUpdate(
            {_id: courseId},
            {$push:{studentsEnrolled:userId}},
            {new:true}, 
        )

        if(!enrolledCourse) {
            return res.status(500).json({success:false, message:"Course not found"});
        }

        const courseProgress = await CourseProgress.create({
            courseID:courseId,
            userId:userId,
            completedVideos: [],
        })

        //find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
            {_id: userId},
            {$push:{
                courses:courseId,
                courseProgress: courseProgress._id
            }},
            {new:true},
        )
        //send the mail
        const emailResponse = await mailSender(
            enrolledStudent.email,
            `Sucecessfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
        )
        // console.log("Email sent sucessfully", emailResponse)
       } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        });
       }
    }
}

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;
    const userId = req.user.id;
    console.log("Maile initiated")
    if(!orderId || !paymentId || !amount || !userId) {  
        return res.status(400).json({success:false, message:"Please provide all the feilds"})
    }

    try {
        const enrolledStudent = await User.findById(userId)
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
            amount/100, orderId, paymentId)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Could not send email",
        });
    }
}
// //capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req,res) => {
//     try{
//         //get course id and user id
//         const {course_id} = req.body;
//         const userId = req.user.id;
//         //validations
//         //valid CourseID
//         if(!course_id) {
//             return res.json({
//                 success:false,
//                 message:'Please provide valid corse ID',
//             })
//         }
//         //valid course details
//         let course;
//         try {
//             course = await Course.findById(course_id);
//             if(!course) {
//                 return res.json({
//                     success:false,
//                     message:'could not find the course',
//                 });
//             }

//             //validate if user has already paid for the same code
//             const uid = new mongoose.Types.ObjectId(userId);
//             if(course.studentsEnrolled.includes(uid)) {
//                 return res.status(200).json({
//                     success: false,
//                     message:'Student is already enrolled',
//                 });
//             }
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
        
//         //create order
//         const amount = course.price;
//         const currency = "INR";

//         const options = {
//             amount: amount *100,
//             currency,
//             receipt: Math.random(Date.now()).toString(),
//             notes:{
//                 courseId: course_id,
//                 userId,
//             }
//         };

//         try {
//             //initiate the payment using razorpay
//             const paymentResponse = await instance.orders.create(options);
//             console.log("Payment Response : ", paymentResponse);
//         } catch (error) {
//             console.log(error);
//             return res.json({
//                 success:false,
//                 message:'Could not initiate order',
//             });
//         }
//         //return response 
//         return res.status(200).json({
//             success:true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount:paymentResponse.amount,
//             message:'Payment successfully',
//         })
//     }
//     catch(error) {
//         console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:'COuld not initiate order',
//             });
//     }
// };

// //verify Signature of razorpay and server

// exports.verifySignature = async (req,res) => {
//     const webhookSecret = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");
    
//     if(signature === shasum) {
//         console.log("Payment is Authorized");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;
        
//         try {
//             //full fill the actions
//             //find the course and enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                                             {_id:courseId},
//                                             {$push:{studentsEnrolled: userId}},
//                                             {new:true},
//             );

//             if(!enrolledCourse) {
//                 return res.status(500).json({
//                     success:false,
//                     message:'Course not found',
//                 });
//             }

//             console.log(enrolledCourse);
            
//             //find the student and add the course to their list enrolled courses
//             const enrolledStudent = await User.findOneAndUpdate(
//                                             {_id:userId},
//                                             {$push:{courses:courseId}},
//                                             {new:true},
//             )

//             console.log(enrolledStudent);

//             //mail send kardo confirmation wala
//             const mailResponse = await mailSender(
//                                    enrolledStudent.email,
//                                    "Congratulations from Study Notion",
//                                    "Congratulations You are onboarded in a new course",     
//             );

//             console.log(mailResponse);

//             return res.status(200).json({
//                 success:true,
//                 message:'Signature verified and Courses Added',
//             });

//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else {
//         return res.status(400).json({
//             success:false,
//             message:'Invaild request',
//         });
//     }

// };