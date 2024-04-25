const Course = require("../models/Course");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const Category = require("../models/Category");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration")

//create Course handler
exports.createCourse = async (req, res) =>{
    try{
        //Get user Id
        const userId = req.user.id;
        //fetch data
        let {courseName, courseDescription, whatYouWillLearn, price, tags: _tags, category, status, instructions: _instructions} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;
        console.log("Thumbnail printing", thumbnail)

        //Convert the tag and instructions from stringified array to array
        const tags = JSON.parse(_tags)
        const instructions = JSON.parse(_instructions)

        console.log("tags", tags)
        console.log("instructions: ", instructions)
        
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tags.length || !instructions.length) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        if (!status || status === undefined) {
			status = "Draft";
		}
        //check for instructor
        const instructorDetails = await User.findById(userId, {
                accountType: "Instructor",
        });
        console.log("instructorDetails :-", instructorDetails);
        //TODO: Verify that userId and instructorDeatls._id are same or different ? 

        if(!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:'Instructor details not found',
            });
        }

        //check given tag is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            return res.status(404).json({
                success:false,
                message:'category Details not found',
            });
        }

        //upload thumbnail to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create entry in DB
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tags,
            category: categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status: status,
            instructions,
        });

        //add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true}, 
        );

        //update the Tag ka schema
        //TODO : HW
        const categoryDetails2 = await Category.findByIdAndUpdate(
            {_id: category},
            {
                $push: {courses:newCourse._id,}
            },
            {new:true},
            );


        //return response
        return res.status(200).json({
            success:true,
            message:'Course Created Successfully',
            data:newCourse,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create course',
            error: error.message,
        });
    }
};

// Edit course Details
exports.editCourse = async (req,res) => {
    try {
        const{courseId} = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if(!courseId) {
            return res.status(404).json({error: "Course not found"})
        }

        //if thumbnail image is found, update it
        if(req.files) {
            console.log("Thumbnail Updates")
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)
            course.thumbnail = thumbnailImage.secure_url
        }

        //update only the feilds that are present in the request body
        for(const key in updates) {
            if(updates.hasOwnProperty(key)) {
                if(key === "tags" || key === "instructions") {
                    course[key] = JSON.parse(updates[key])
                } else {
                    course[key] = updates[key]
                }
            }
        }

        await course.save()

        const updatedCourse = await Course.findOne({
            _id: courseId, 
        }).populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();

        res.json({
            success:true,
            message:"Course updated successfully",
            data:updatedCourse,
        })
    } catch (error) {
        console.error(error) 
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
          })      
    }
}

//get all courses handler function
exports.showAllCourses = async (req, res) => {
    try{
        //TODO: change the below statement incrementally
        const allCourses = await Course.find({},
            {
                courseName: true,
                price:true,
                thumbnail:true,
                instructor:true,
                ratingAndReviews:true,
                studentsEnrolled:true,
            })
            .populate("instructor")
            .exec();

        //return response
        return res.status(200).json({
            success:true,
            message:'Data for all courses fetched Successfully',
            data:allCourses,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Failed to get all courses',
            error: error.message,
        });
    }
}


//get all course details
exports.getAllCourseDetails = async (req, res) => {
    try {
        //get course id
        const {courseId} = req.body;
        //find course details
        const courseDetails = await Course.findOne({
            _id: courseId,
        }).populate({
            path:"instructor",
            populate: {
                path: "additionalDetails",
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
                select: "-videoUrl"
            },
        })
        .populate("tags")
        .exec()

        //validation
        if(!courseDetails) {
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`,
            });
        }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        return res.status(200).json({
            success:true,
            data:{
                courseDetails,
                totalDuration,
            },
            message:'Details for all courses fetched Successfully',
            
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Failed to get all courses',
            error: error.message,
        });
    }
}

//Get a list of courses for a given instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        //Get the instructor id
        const instructorId = req.user.id;

        if(!instructorId) {
            res.status(404).json({
                success:false,
                message:"Instructor ID is missing",
            })
        }

        //Find all courses belonging to the instructor
        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({createdAt: -1})

        //return response
        res.status(200).json({
            success:true,
            data: instructorCourses,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success:false,
            message:"Failed to retrieve the intructor courses",
            error: error.message,
        })
    }
}

//DELETE SELECTED COURSE
exports.deleteCourse = async (req, res) => {
    //GEt the course id
    try {
        const {courseId} = req.body;

        //Find the course
        const course = await Course.findById(courseId)
        if(!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        //Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for(const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: {courses: courseId},    
            })
        }

        //delete the section and the subsection
        const courseSection = course.courseContent
        for(const sectionId of courseSection) {
            //delete the sub section of the section
            const section = await Section.findById(sectionId)
            if(section) {
                const subSections = section.subSection
                for(const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            //Delete the section
            await Section.findByIdAndDelete(sectionId)
        }

        //Delete the course
        await Course.findByIdAndDelete(courseId)

        //return response
        res.status(200).json({
            success:true,
            message:"Course deleted successfully",
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success:false,
            message:"Failed to delete the courses",
            error: error.message,
        })
    }
}

//FIND COURSE DETAILS FOR A SPECIFIC COURSE
exports.getFullDetailsofACourse = async (req, res) => {
    try {
        const {courseId} = req.body
        const userId = req.user.id
        const courseDetails = await Course.findOne({
            _id: courseId,
        }).populate({
            path:"instructor",
            populate: {
                path: "additionalDetails",
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .populate("tags")
        .exec()

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })
        console.log("courseProgressCount : ", courseProgressCount)

        if(!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
              })        
        }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
              courseDetails,
              totalDuration,
              completedVideos: courseProgressCount?.completedVideos
                ? courseProgressCount?.completedVideos
                : [],
            },
          })
      
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          })      
    }
} 