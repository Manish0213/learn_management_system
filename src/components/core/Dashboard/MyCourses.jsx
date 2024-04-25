import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import Iconbtn from '../../common/Iconbtn'
import { FiPlus } from "react-icons/fi";
import CourseTable from './Instructor/CourseTable'

export default function MyCourses() {

    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const dispatch = useDispatch();


    useEffect(() => {
        const fetchCourses = async() => {
            const result = await fetchInstructorCourses(token);
            if(result) {
                dispatch(setCourses(result));
            }
        }
        fetchCourses();
    },[])
  return (
    <div>
        <div className='flex justify-between'>
            <h1 className='font-inter text-3xl font-medium mt-2 text-richblack-5'>My Courses</h1>
            <Iconbtn
                text="Add Courses"
                onclick={() => navigate("/dashboard/add-course")}
            >
                <FiPlus/>
            </Iconbtn>
        </div>

        {courses && <CourseTable courses={courses} setCourses={setCourses} />}
    </div>
  )
}
