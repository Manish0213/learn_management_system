import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {useDispatch, useSelector} from 'react-redux'
import Iconbtn from '../../../../common/Iconbtn';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { resetCourseState, setStep } from '../../../../../slices/courseSlice';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import {useNavigate} from 'react-router-dom'

const PublishForm = () => {

    const {register, setValue, getValues, handleSubmit} = useForm();
    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if(course?.status === COURSE_STATUS.PUBLISHED) {
            setValue("public", true)
        }
    },[])

    const goBack = () => {
        dispatch(setStep(2));
    }

    const goToCourses = () => {
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses")
    }

    const handleCoursePublish = async () => {
        if((course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) ||
        (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)) {
            //no updation in form
            //no need to make api call
            goToCourses();
            return;
        }
        //if form is updated
        const formData = new FormData();
        formData.append("courseId",course._id);
        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
        formData.append("status",courseStatus);
        console.log("id & status", course._id,courseStatus)

        setLoading(true);
        const result = await editCourseDetails(formData, token);

        if(result) {
            goToCourses();
        }

        setLoading(false);
    }
    const onSubmit = () => {
        handleCoursePublish();
    }

    return (
    <div className='rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 space-y-8'>
        <p className="text-2xl font-semibold text-richblack-5">Publish Course</p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col space-y-3'>
                <label htmlFor='public' className='lable-style'>
                <input
                    type='checkbox'
                    id='public'
                    {...register("public")}
                    className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                />
                <span className="ml-2 text-richblack-400">Make this Course Public</span>
                </label>
            </div>
            
            <div className='flex mt-4 justify-end gap-x-5'>
                <button onClick={goBack} disabled={loading} type='button' 
                className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900">
                    Back
                </button>
                <Iconbtn
                    text="Save Changes"
                    // onclick={goToNext}
                    
                />
            </div>
        </form>
        
    </div>
  )
}

export default PublishForm