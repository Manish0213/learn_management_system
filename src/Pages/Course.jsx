import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
// import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import Markdown from 'react-markdown'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import RatingStars from "../components/common/RatingStars"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import {  getCourseDetails } from "../services/operations/courseDetailsAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"
import Footer from "../components/common/Footer"
import ConfirmationModal from "../components/common/ConfirmationModal"
import Accordion from "../components/core/Course/Accordion"
import { formatDate } from "../services/formDate"
import { buyCourse } from "../services/operations/paymentAPI"
import { ACCOUNT_TYPE } from "../utils/constants"
import toast from "react-hot-toast"
import { addToCart } from "../slices/cartSlice"

function Course() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { courseId } = useParams()
  // console.log(`course id: ${courseId}`)

  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getCourseDetails(courseId)
        console.log("course details res: ", res)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    })()
  }, [courseId])

  console.log("response: ", response)

  // Calculating Avg Review count
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
    setAvgReviewCount(count)
  }, [response])
  // console.log("avgReviewCount: ", avgReviewCount)

  // // Collapse all
  // const [collapse, setCollapse] = useState("")
  const [isActive, setIsActive] = useState(Array(0))
  const handleActive = (id) => {
    // console.log("called", id)
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    )
  }

  // Total number of lectures
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!response.success) {
    return <Error />
  }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = response.data.courseDetails

  let course=response?.data?.courseDetails

  const handleBuyCourse = () => {
    if (token) {
        buyCourse(token, [courseId], user, navigate, dispatch)
        return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {
    // console.log("payment loading")
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
      localStorage.setItem(("cart"))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }
 
  return (
    <>
      <div className={`relative w-full bg-richblack-800`}>
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] lg:flex lg:justify-between  lg:relative ">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[680px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div
              className={` my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {courseName}
                </p>
              </div>
              <p className={`text-richblack-200`}>{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                <span>{`${studentsEnrolled.length} students enrolled`}</span>
              </div>
              <div>
                <p className="">
                  Created By {`${instructor.firstName} ${instructor.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button
              className="yellowButton"
              onClick={
                user && course?.studentsEnrolled.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
              >
              {user && course?.studentsEnrolled.includes(user?._id)
                ? "Go To Course"
                : "Buy Now"}
              </button>
              {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
                <button onClick={handleAddToCart} className="blackButton">
                  Add to Cart
                </button>
              )}
            </div>
          </div>
          {/* Courses Card */}
          <div className="right-0 top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
            <CourseDetailsCard
              course={response?.data?.courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[670px]">
          {/* What will you learn section */}
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5">
              <Markdown>{whatYouWillLearn}</Markdown>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="max-w-[830px] ">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>
                    {courseContent.length} {`section(s)`}
                  </span>
                  <span>
                    {totalNoOfLectures} {`lecture(s)`}
                  </span>
                  <span>{response.data?.totalDuration} total length</span>
                </div>
                <div>
                  <button
                    className="text-yellow-25"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
            </div>

            {/* Course Details Accordion */}
            <div className="py-4">
              {courseContent?.map((course, index) => (
                <Accordion
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            {/* Author Details */}
            <div className="mb-12 py-4">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    instructor.images
                      ? instructor.images
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt="Author"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
              </div>
              <p className="text-richblack-50">
                {instructor?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default Course



// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { useNavigate, useParams } from 'react-router-dom'
// import { getCourseDetails } from '../services/operations/courseDetailsAPI'
// import Iconbtn from '../components/common/Iconbtn'
// import { FaCaretRight } from "react-icons/fa";
// import { FaShareFromSquare } from "react-icons/fa6";
// import Footer from '../components/common/Footer'
// import Accordion from '../components/common/Accordion'
// import { ACCOUNT_TYPE } from '../utils/constants'
// import toast from 'react-hot-toast'
// import ConfirmationModal from '../components/common/ConfirmationModal'

// const Course = () => {
//     const {course} = useSelector((state) => state.course)
//     const navigate = useNavigate()
//     const {user} = useSelector((state) => state.profile)
//     const {courseId} = useParams();
//     const [coursePageData, setCoursePageData] = useState(null)
//     const [confirmationmodal, setConfirmationModal] = useState(null)

//     useEffect(() => {
//         const getCourse = async () => {
//             try {
//                 // console.log("Category iD::",courseId)
//                 const result = await getCourseDetails(courseId);
//                 setCoursePageData(result);
//             } catch (error) {
//                 console.log(error)
//             }
//         }
//         if(courseId) {
//             getCourse();
//         }
//     },[courseId])

//     console.log("RESULT>>>>", coursePageData)

//     const loginHandler =  () => {
//         navigate("/dashboard/my-profile")
//     }
//     console.log("Accordion 2", coursePageData?.data?.courseContent)

   

//   return (
//     <>
//         <div className='text-richblack-5 bg-richblack-800 '>
//             <div className='flex justify-between lg:w-11/12 mx-auto my-28 relative'>
//                 <div className='flex flex-col space-y-2'>
//                     <p className='text ring-richblack-5 text-4xl font-inter font-bold'>{coursePageData?.data?.courseDetails?.courseName}</p>
//                     <p className='text ring-richblack-5 text-base font-inter '>{coursePageData?.data?.courseDetails?.courseDescription}</p>
//                     <p>{coursePageData?.data?.courseDetails?.studentsEnrolled.length ? coursePageData?.data?.studentsEnrolled : 0 } students enrolled</p>
//                     <p>Created By {coursePageData?.data?.courseDetails?.instructor?.firstName} {coursePageData?.data?.courseDetails?.instructor?.lastName}</p>
//                     <p></p>
//                 </div>
//                 <div className='absolute right-0 -top-10'>
//                     <div className='bg-richblack-700 px-6 py-4 rounded-lg flex flex-col '>
//                         <img
//                             src={coursePageData?.data?.courseDetails?.thumbnail}
//                             alt='course thumbanil'
//                             className='w-[330px] h-[210px] rounded-xl'
//                         />
//                         <p className='my-3 text-xl font-inter font-medium' >Rs. {coursePageData?.data?.courseDetails?.price}</p>
//                         <Iconbtn
//                             onclick={() => {
//                                 setConfirmationModal({
//                                     text1: "You are not logged in!",
//                                     text2: "Please login to Purchase Course",
//                                     btn1Text: "Login",
//                                     btn2Text: "Cancel",
//                                     btn1Handler: () => loginHandler(),
//                                     btn2Handler: () => setConfirmationModal(null)
//                                 })
//                             }}
//                             text="Buy Now"
//                             type="button"
//                             customClasses="justify-center"
//                         />
//                         <button
//                          onClick={() => {
//                             user?.accountType !== ACCOUNT_TYPE.STUDENT ? 
//                             setConfirmationModal({
//                                 text1: "You are not logged in!",
//                                 text2: "Please login to add to Cart",
//                                 btn1Text: "Login",
//                                 btn2Text: "Cancel",
//                                 btn1Handler: () => loginHandler(),
//                                 btn2Handler: () => setConfirmationModal(null)
//                             }) : (<div></div>)
//                          }} 
//                          className='cursor-pointer gap-x-2 my-4 rounded-md py-2 px-5 font-semibold text-richblack-25 bg-richblack-900 mb-2'
//                         >
//                             Add to Cart
//                         </button>
//                         <p className='text-center text-xs mt-3'>30-Day Money-Back Guarantee</p>
//                         <div className='flex flex-col my-4'>
//                             <p>This Course Includes:</p>
//                             {
//                                 coursePageData?.data?.courseDetails?.tags.map((tag, i) => (
//                                     <div className='flex space-x-2 items-center'>
//                                         <FaCaretRight className='text-caribbeangreen-100'></FaCaretRight>
//                                         <p className='text-caribbeangreen-100'>{tag}</p>
//                                     </div>
//                                 ))
//                             }
//                         </div>
//                         <p className='flex items-center text-yellow-50 justify-center gap-2'>
//                             <FaShareFromSquare className='text-yellow-50'/>
//                             Share
//                         </p>

//                     </div>
//                 </div>
//             </div>
//         </div>

//         <div className='text-richblack-5 bg-richblack-900'>
//             <div className='flex flex-col lg:w-11/12 mx-auto mt-10 '>
//                 <div className='border border-richblack-300 lg:w-[61%] py-7 px-7'>
//                     <h4 className='text-[28px] font-inter font-semibold'>What you'll learn</h4>
//                     <p className='text-base text-richblack-5 mt-3'>{coursePageData?.data?.courseDetails?.whatYouWillLearn}</p>
//                 </div>

//                 <div className='mt-6 lg:w-[61%]'>
//                     <h3 className='text-2xl font-semibold'>Course Content</h3>
//                     <div className='flex justify-between'>
//                         <div className='flex items-center gap-4'>
//                             <p>section(s)</p>
//                             <p>lecture(s)</p>
//                             <p>s total length</p>
//                         </div>
//                         <div className='text-yellow-50'>Collapse all sections</div>
//                     </div>
//                     <div className='mt-3'>
//                         <Accordion Courses={coursePageData?.data?.courseDetails?.courseContent}/>
//                     </div>
//                 </div>
                
               

//                 <div className='mt-5 flex flex-col mb-16'>
//                     <h3 className='text-2xl font-semibold mb-3'>Author</h3>
//                     <div className='flex items-center gap-3'>
//                         <img
//                             src={coursePageData?.data?.courseDetails?.instructor?.images}
//                             alt='Author image'
//                             className='aspect-auto object-cover w-[55px] h-[55px] rounded-full'
//                         />
//                         <p>{coursePageData?.data?.courseDetails?.firstName} {coursePageData?.data?.courseDetails?.instructor?.lastName}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <Footer/>
//         {confirmationmodal && <ConfirmationModal modalData={confirmationmodal}/>}
//     </>
//   )
// }

// export default Course