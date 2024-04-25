const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req,res) => {
    try{
        //fetch data
        const {sectionName, CourseId} = req.body;
        //validate data
        if(!sectionName || !CourseId) {
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update course with section objectId
        const updatedCourseDeatails = await Course.findByIdAndUpdate(
                                                                    CourseId,
                                                                    {
                                                                        $push:{
                                                                            courseContent:newSection._id,
                                                                        }
                                                                    },
                                                                    {new:true},
                                                                )
                                                                .populate({
                                                                    path: "courseContent",
                                                                    populate: {
                                                                        path: "subSection",
                                                                    },
                                                                })
                                                                .exec();
        //HW: use populate to replace section/sub-sections both in the updated course details
        //return response
        return res.status(200).json({
            success:true,
            message:'Section created successfully',
            updatedCourseDeatails,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'unable to create section, please try again',
        });
    }
}


exports.updateSection = async (req, res) => {
    try{
        //fecth data
        const {sectionName, sectionId, courseId} = req.body;
        //validate data
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        const course = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection", 
            },
        })
        .exec();

        //return res
        return res.status(200).json({
            success:true,
            message:'Section updated successfully',
            data:course,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'unable to update section, please try again',
        });    
    }
};

exports.deleteSection = async (req, res) => {
    try{
        //get Id - assuming that we are sending ID in params
        
        const {sectionId, courseId} = req.body;
        //validate
        if(!sectionId) {
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }
        //delete it by using findby id and delete
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        })
        const section = await Section.findById(sectionId);
        console.log("Id's: ",sectionId, courseId);
        if(!section) {
            return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
        }

        //delete subsection corresponding
        await SubSection.deleteMany({_id: {$in: section.subSection}});
        await Section.findByIdAndDelete(sectionId);

        //return the updated course
        const course = await Course.findById(courseId).populate({
            path:"courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();
 
        //return response
        return res.status(200).json({
            success:true,
            message:'Section deleted successfully',
            data:course
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'unable to delete section, please try again',
        }); 
    }
}
