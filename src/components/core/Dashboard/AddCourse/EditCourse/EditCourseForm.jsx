import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'
import RenderSteps from '../RenderSteps';
import { getFullDetailsofCourse } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse } from '../../../../../slices/courseSlice';

const EditCourseForm = () => {

    const dispatch = useDispatch();
    const {courseId} = useParams();
    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const populateCourseDetails = async() => {
            setLoading(true);
            const result = await getFullDetailsofCourse(courseId, token)
            if(result?.courseDetails) {
                dispatch(setEditCourse(true));
                dispatch(setCourse(result?.courseDetails));
            }
            setLoading(false);
        }
        populateCourseDetails();
    },[])

    if(loading) {
        return (
            <>
                <div className='text-richblack-50 flex items-center w-full mx-auto text-2xl'>
                    Loading...
                </div>
            </>
        )
    }
  return (
    <div>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Course</h1>
        <div>
            {
                course ? (<RenderSteps/>) : (<p className="py-10 text-center text-2xl font-medium text-richblack-100">Course Not Found</p>)
            }
        </div>
    </div>
  )
}

export default EditCourseForm