const Category = require("../models/Category");
const Course = require("../models/Course");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

//create a tag
exports.createCategory = async (req, res) => {
    try{
        //fetch data
        const {name, description} = req.body;
        //validate data
        if(!name ) {
            return res.status(400).json({
                success:false,
                message:'All feilds are required',
            });
        }
        
        //create entry in db
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log("Category Deatils:-",categoryDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:'Category created successfully',
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//Get all category handler function
exports.showAllCategory = async (req,res) => {
    try{
        const allCategories = await Category.find();
        return res.status(200).json({
            success:true,
            message:'All categories returned successfully',
            data: allCategories,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//category page details
exports.categoryPageDetails = async (req, res) => {
    try {
        //get category id
        const {categoryId} = req.body;
        //get course for specified category
        const selectedCategory = await Category.findById(categoryId)
                                        .populate({
                                            path: "courses",
                                            match: {status: "Published"},
                                            populate: "ratingAndReviews",
                                        })
                                        .exec();
        
        console.log("SELECTED COURSE", selectedCategory)
        
        //validation 
        if(!selectedCategory) {
            return res.status(404).json({
                success:false,
                message:'Category not found',
            });
        }

        //Handling the case where there are no courses found
        if(selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
              success: false,
              message: "No courses found for the selected category.",
            })       
        }

        //get courses for other / different category
        const categoryExceptSelected = await Category.find({
            _id: {$ne : categoryId},
        })
        let differentCategory = await Category.findOne(
            categoryExceptSelected[getRandomInt(categoryExceptSelected.length)]
            ._id
        )
            .populate({
                path: "courses",
                match: {status: "Published"},
            })
            .exec()

        
        //get top selling courses
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: {status: "Published"},
            })
            .exec()
        
            const allCourses = allCategories.flatMap((category) => category.courses)
            const mostSellingCourses = allCourses
                .sort((a, b) => b.sold - a.sold)
                .slice(0,10)

        // const topSellerCourse = await Course.find({studentsEnrolled : {$gt: 10}})
        //                                 .sort({studentsEnrolled: -1})
        //                                 .limit(10);
        

        //return response
        return res.status(200).json({
            success:true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

