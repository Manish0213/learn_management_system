import toast from "react-hot-toast";
import { profileEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";


const {GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API} = profileEndpoints

export async function getUserEnrolledCourses(token) {
    // const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiConnector(
            "GET", 
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`
            })

        if(!response.data.success) {
            throw new Error(response.data.message)
        }

        //console.log("ENROLLED COURSE API RESPONSE -----------",response)
        result = response.data.data
        
    } catch (error) {
        console.log("Enrolled Courses API ERROR............", error)
        toast.error("Failed to get Courses")
    }
    // toast.dismiss(toastId)
    return result
}

export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...")
    let result = [];
    try {
      const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
        Authorization: `Bearer ${token}`
      })
    
    if(!response?.data?.courses) {
        throw new Error("Could Not Get Instructor Data")
    }

    console.log("INSTRUCTOR DATA API RESPONSE -----------",response)
    result = response?.data?.courses
    
    } catch (error) {
      console.log("GET INSTRUCTOR API ERROR............", error)
      toast.error("Could not get Instructor Data")  
    }
    toast.dismiss(toastId);
    return result;
  }