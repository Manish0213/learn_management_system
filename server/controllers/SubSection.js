const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const { findById } = require("../models/Profile");

exports.createSubSection = async (req,res) => {
    try{
        //fetch data from req body
        const {sectionId, title, description} = req.body;
        //fetch video
        const video = req.files.video;
        //validate data
        if(!title  || !description || !video || !sectionId) {
            return res.status(400).json({
                success:false,
                message:'All Fields are Required',
            });
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME); 
        console.log(uploadDetails)
        //create subsection
        const subSectionDetails = await SubSection.create(
            {
                title:title,
                timeDuration: `${uploadDetails.duration}`,
                description:description,
                videoUrl:uploadDetails.secure_url,
            }
        )
        //update section with this sub section object
        const updatedSection = await Section.findByIdAndUpdate(
                                                    {_id:sectionId},
                                                    {
                                                        $push:{
                                                            subSection:subSectionDetails._id,
                                                        }
                                                    },
                                                    {new:true}
        ).populate("subSection").exec();
        console.log("Updated section with sub section = ",updatedSection);
        //HW log updated section here , at=fter adding populate query
        //return response
        return res.status(200).json({
            success:true,
            message:'sub section created successfully',
            data: updatedSection,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Internal server error',
        });
    }
};

//HW: update subsection
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId,subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
      
      const updatedSection = await Section.findById(sectionId).populate("subSection")

      return res.json({
        success: true,
        data:updatedSection,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }

//HW: delete Sub Section
exports.deleteSubSection = async (req,res) => {
    try{
        //get id
        
        const { subSectionId, sectionId } = req.body;
        await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
        //validate
        if(!subSectionId) {
            return res.status(400).json({
                success:false,
                message:'Missing Subsection Id',
            });
        }
        //delete the sub section
        const subSection =  await SubSection.findByIdAndDelete({_id:subSectionId});

        if(!subSection) {
          return res.status(404).json({
            success:false,
            message:"SubSection not found"
          })
        }

        const updatedSection = await Section.findById(sectionId).populate("subSection")
        //return response
        return res.status(200).json({
            success:true,
            data:updatedSection,
            message:'Sub Section deleted successfully',
        });

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Internal server error',
        });
    }
}