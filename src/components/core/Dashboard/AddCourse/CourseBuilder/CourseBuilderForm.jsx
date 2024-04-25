import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Iconbtn from '../../../../common/Iconbtn';
import {MdAddCircleOutline} from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';

const CourseBuilderForm = () => {

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors}
  } = useForm();

  const [editSectionName, setEditSectionName] = useState(null)
  const [loading, setLoading] = useState(false);
  const {course} = useSelector((state) => state.course);
  const {token} = useSelector((state) => state.auth);
  const dispatch = useDispatch()


  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  }

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }

  const goToNext = () => {
    if(course.courseContent.length === 0) {
      toast.error("Please add atleast one section");
      return;
    }
    if(course.courseContent.some((section) => section.subSection.length === 0)) {
      toast.error("Please add atleast one lecture in each section")
      return;
    }
    dispatch(setStep(3))
  }
 
  const onSubmit = async (data) => {
    setLoading(true);
    let result;
    if(editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        }, token
      )
    }
    else {
      result = await createSection({
          sectionName: data.sectionName,
          CourseId: course._id,
        }, token)
    }

    //Update values
    if(result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    setLoading(false);
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if(editSectionName === sectionId) {
      cancelEdit();
      return;
    }

    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  }

  return (
    <div className='space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label htmlFor='sectionName' className='lable-style'>Section name <sup className='text-pink-300'>*</sup></label>
            <input
              id='sectionName'
              placeholder='Add section name'
              {...register("sectionName", {required:true})}
              className='w-full form-style'
            />
            { errors.sectionName && (
              <span className='text-white'>Section name is required</span>
            )}
        </div>
        <div className='flex gap-5 items-end mt-4'> 
            <Iconbtn
              type="Submit"
              text={editSectionName ? "Edit Section Name" : "Create Section"}
              outline={true}
              customClasses={true}
            >
              <MdAddCircleOutline size={22} className='text-yellow-50'/>
            </Iconbtn>
            {
              editSectionName && (
                <button
                type='button'
                onClick={cancelEdit}
                className='text-sm text-richblack-300 underline'
                >
                  Cancle Edit
                </button>
              )
            }
        </div>
      </form>

      {
        course.courseContent.length > 0 && (
         <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
        )
      }

      <div className='flex justify-end gap-x-5'>
        <button onClick={goBack} className='rounded-md text-white cursor-pointer flex items-center'>
          Back
        </button>
        <Iconbtn
          text="Next"
          onclick={goToNext}
          next={true}
        />
      </div>
    </div>
  )
}

export default CourseBuilderForm