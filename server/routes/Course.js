// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const { createCourse, showAllCourses, getAllCourseDetails, editCourse, getInstructorCourses, deleteCourse, getFullDetailsofACourse } = require("../controllers/Course");

// Categories Controllers Import
const { createCategory, showAllCategory, categoryPageDetails } = require("../controllers/Category");

// Sections Controllers Import
const { createSection, updateSection, deleteSection } = require("../controllers/Section");

// Sub-Sections Controllers Import
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/SubSection");

// Rating Controllers Import
const { createRating, getAverageRating, getAllRatingAndReviews } = require("../controllers/RatingAndReview");

// CourseProgress Controllers Import
const {updateCourseProgress} = require("../controllers/CourseProgress");

// Importing Middlewares
const { auth, isStudent, isInstructor, isAdmin } = require("../middleware/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", showAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getAllCourseDetails)
// Edit course details
router.post("/editCourse", editCourse)
//Get Isntructor Courses
router.get("/getInstructorCourses",auth, isInstructor, getInstructorCourses)
//DElete a course
router.delete("/deleteCourse",deleteCourse)
//GET DETAILS OF A COURSE 
router.post("/getFullCourseDetails",auth, getFullDetailsofACourse)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategory)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Course Progress routes
// ********************************************************************************************************
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingAndReviews)

module.exports = router;