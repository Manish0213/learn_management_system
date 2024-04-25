const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const Profile = require("../models/Profile");
const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");

exports.updateProfile = async (req,res) => {
    try{
        //fetch data
        const {firstName="", lastName="", dayeOfBirth="" , about="", contactNumber, gender=""} = req.body;
        //get user id
        const id = req.user.id;
        
        //find profile
        const userDetails = await User.findById(id);
        //const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(userDetails.additionalDetails);

        const user = await User.findByIdAndUpdate(id, {
          firstName,
          lastName,
        })
        await user.save()
        //update Profile
        profileDetails.dayeOfBirth = dayeOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        //findbyid and update user details
        const updatedUserDetails = await User.findById(id)
          .populate("additionalDetails")
          .exec()

        //return response
        return res.status(200).json({
            success:true,
            message:'Profile Updated successfully',
            updatedUserDetails,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Unable to update Profile Details, Please try again',
        });
    }
};

//HW Delete Account
//Explore -> how can we schedule this deletion operation
exports.deleteAccount = async (req, res) => {
    try{
        //TODO: Find more on job schedule
        // const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
        //get user id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById({_id:id});
        if(!userDetails) {
            return res.status(400).json({
                success:false,
                message:'User not found',
            });
        }
        for (const courseId of userDetails.courses) {
          await Course.findByIdAndUpdate(
            courseId,
            { $pull: { studentsEnrolled: id } },
            { $pull: { ratingAndReviews: id}},
            { new: true }
          )
        }
    
        //delete Profile 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //TODO: HW unenroll user from all enrolled courses
        //delete user
        await User.findByIdAndDelete({_id:id});

        //return response
        return res.status(200).json({
            success:true,
            message:'User Deleted successfully',
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Unable to delete user Account, Please try again',
        });
    }
};

exports.getAllUserDetails = async (req,res) => {
    try{
        //get user id
        const id = req.user.id;
        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //return response
        return res.status(200).json({
            success:true,
            message:'User Data fetched successfully',
            data: userDetails,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Unable to fetch user details, Please try again',
        });
    }
};


exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { images: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};


exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path:"courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            }
          }
        })
        .exec()

        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
              j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
              totalDurationInSeconds
            )
            SubsectionLength +=
              userDetails.courses[i].courseContent[j].subSection.length
          }
          let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
          })
          courseProgressCount = courseProgressCount?.completedVideos.length
          if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
              Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
              ) / multiplier
          }
        }    


      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.instructorDashboard = async(req, res) => {
  try {
    const courseDetails = await Course.find({instructor: req.user.id});
    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      //creating a new object with the additional data
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      }
      return courseDataWithStats
    })

    res.status(200).json({courses:courseData});
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}