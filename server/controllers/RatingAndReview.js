const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create a rating
exports.createRating = async (req,res) => {
    try {
        console.log("INSIDE CREATE RATING")
        //get userId
        const userId = req.user.id;
        //fetch data
        const {rating, review, courseId} = req.body;
        //vaildate
        if(!rating || !review || !userId || !courseId) {
            return res.json({
                success:false,
                message:'Fields missing',
            });
        }
        //check if user is enrolled
        const courseDetails = await Course.findOne(
                                    {_id:courseId,
                                    studentsEnrolled: {$elemMatch: {$eq: userId}},
                                });
        if(!courseDetails) {
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in course',
            });
        }
        //check if user already reviewd the course
        const alreadyReviewed = await RatingAndReview.findOne({
                                                user:userId,
                                                course:courseId,
        });
        if(alreadyReviewed) {
            return res.status(403).json({
                success:false,
                message:'Course is already reviewed by the user',
            });
        }
        console.log("CREATING RATING")
        //create rating and review
        const newRating = await RatingAndReview.create({
                                    rating, review,
                                    course:courseId,
                                    user:userId,    
                                });
        console.log("UPDATEING COURSE")
        //update the rating and review in course object
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                {_id:courseId},
                                {$push:{ratingAndReviews:newRating._id}},
                                {new:true}, 
        );
        console.log("updated Course Details:",updatedCourseDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:'Rating and Review created successfully',
            newRating,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'unable to create Rating and Review, please try again',
        });
    }
}

// get avg rating
exports.getAverageRating = async (req,res) => {
    try {
        //get course id
        const courseId = req.body.courseId;

        //calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating: { $avg: "$rating"},
                }
            }
        ]);
        //return rating
        if(result.length > 0) {
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }

        //if no rating review exist
        return res.status(200).json({
            success:true,
            message:'Avearge Rating is 0, no ratings given till now',
            averageRating:0,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'unable to get average Rating and Review, please try again',
        });
    }
}


//get all rating
exports.getAllRatingAndReviews = async (req, res) => {
    try {
        const allRatings = await RatingAndReview.find({})
                                .sort({rating: "desc"})
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email images",
                                })
                                .populate({
                                    path: "course",
                                    select: "courseName",
                                })
                                .exec();
        //return response
        return res.status(200).json({
            success:true,
            message:'All Rating and Review fetched successfully',
            data: allRatings,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'unable to fetch All Rating and Review, please try again',
        });
    }
}


//get ratings and reviews corresponding to course ID
//need additional things
exports.getCourseRating = async (req,res) => {
    try {
        //get course id
        const courseId = req.body.courseId;
        
        //get course rating and review
        const courseRating = await RatingAndReview.find({_id:courseId})
                                                .populate("course")
                                                .exec();

        return res.status(200).json({
            success:true,
            message:'Course Rating and reviews fetched successfully',
            data: courseRating,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'unable to Specified Course Rating and Review, please try again',
        });
    }
}