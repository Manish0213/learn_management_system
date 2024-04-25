import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import RequirementField from './RequirementField';
import { setCourse, setStep } from '../../../../../slices/courseSlice';
import Iconbtn from '../../../../common/Iconbtn';
import TagsField from './TagsField';
import toast from 'react-hot-toast';
import { COURSE_STATUS } from '../../../../../utils/constants';
import Upload from '../Upload';
import {useNavigate} from 'react-router-dom'

const CourseInformationForm = () => {
  
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: {errors},
    } = useForm();
  
    const dispatch = useDispatch();
    const {course, editCourse} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [courseCategories, setCourseCategories] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
      const getCategories = async() => {
        setLoading(true);
        const categories = await fetchCourseCategories();
        if(categories.length > 0) {
          setCourseCategories(categories);
        }
        setLoading(false);
      }
      // if form is in edit mode
      if(editCourse) {
        console.log("Data Populated....",editCourse)
        setValue("courseTitle",course.courseName);
        setValue("courseShortDesc",course.courseDescription);
        setValue("coursePrice",course.price);
        setValue("courseTags",course.tags);
        setValue("courseBenefits",course.whatYouWillLearn);
        setValue("courseCategory",course.category);
        setValue("courseRequirements",course.instructions);
        setValue("thumbnailImage",course.thumbnail);
      }

      getCategories();
    }, [])

    const isFormUpdated = () => {
      const currentValues = getValues();
      console.log("changes after editing form values:", currentValues)
      if(currentValues.courseTitle !== course.courseName ||
        currentValues.courseShortDesc !== course.courseDescription ||
        currentValues.coursePrice !== course.price ||
        currentValues.courseTags.toString() !== course.tags.toString() ||
        currentValues.courseBenefits !== course.whatYouWillLearn ||
        currentValues.courseCategory._id !== course.category._id ||
        currentValues.thumbnailImage !== course.thumbnail ||
        currentValues.courseRequirements.toString() !== course.instructions.toString()
        ) {
        return true;
        } 
        return false;
    }


    //handle next button click
    const onSubmit = async(data) => {
      console.log("data...", data)
      
      if(editCourse) {
        const currentValues = getValues()
        console.log("changes after editing form values:", currentValues)
        console.log("now course:", course)
        console.log("Has Form Changed:", isFormUpdated())

        if(isFormUpdated()) {
          const currentValues = getValues();
      const formData = new FormData();
      
      formData.append("courseId", course._id);
      if(currentValues.courseTitle !== course.courseName) {
        formData.append("courseName", data.courseTitle);
      }

      if(currentValues.courseShortDesc !== course.courseDescription) {
        formData.append("courseDescription", data.courseShortDesc)
      }

      if(currentValues.coursePrice !== course.price) {
        formData.append("price", data.coursePrice)
      }

      if(currentValues.courseTags.toString() !== course.tags.toString()) {
         formData.append("tags", JSON.stringify(data.courseTags))
      }

      if(currentValues.courseBenefits !== course.whatYouWillLearn) {
        formData.append("whatYouWillLearn", data.courseBenefits)
      }

      if(currentValues.courseCategory._id !== course.category._id) {
        formData.append("category", data.courseCategory)
      }

      if(currentValues.courseRequirements.toString() !== course.instructions.toString()) {
        formData.append("instructions", JSON.stringify(data.courseRequirements));
      }

      if(currentValues.thumbnailImage !== course.thumbnail) {
        formData.append("thumbnailImage", data.thumbnailImage)
      }
      // Logging from formData      
      console.log("Edit Form data: ", formData)

      setLoading(true);
      const result = await editCourseDetails(formData, token)
      setLoading(false);
      if(result) {
        dispatch(setStep(2));
        dispatch(setCourse(result))
      }
      }
      else {
        toast.error("No changes made so far")
      }
      console.log("PRINTING FORMDATA", formData);
      console.log("PRINTING RESULT", result);
      return;
      }

      //create course
      const formData = new FormData();
      formData.append("courseName", data.courseTitle);
      formData.append("courseDescription", data.courseShortDesc);
      formData.append("price", data.coursePrice);
      formData.append("whatYouWillLearn", data.courseBenefits);
      formData.append("category", data.courseCategory);
      formData.append("tags", JSON.stringify(data.courseTags))
      formData.append("thumbnailImage",data.thumbnailImage)
      formData.append("instructions", JSON.stringify(data.courseRequirements));
      formData.append("status", COURSE_STATUS.DRAFT);

      // Logging from formData      
      // console.log("courseName:", formData.get("courseName"));
      // console.log("courseDescription:", formData.get("courseDescription"));
      // console.log("price:", formData.get("price"));
      // console.log("whatYouWillLearn:", formData.get("whatYouWillLearn"));
      // console.log("category:", formData.get("category"));
      // console.log("tags value:", formData.get("tags"));
      // console.log("thumbnail value:", formData.get("thumbnailImage"));
      // console.log("instructions:", formData.get("instructions"));

      setLoading(true);
      const result = await addCourseDetails(formData, token)
      if(result) {
        dispatch(setStep(2));
        dispatch(setCourse(result));
      }
      setLoading(false);
      console.log("PRINTING FORMDATA", formData);
      console.log("PRINTING RESULT", result);
    }
    
    return (
    <form onSubmit={handleSubmit(onSubmit)}
    className='rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 space-y-8'
    >
      <div>
        <label htmlFor='courseTitle' className='lable-style'>Course Title <sup className='text-pink-300'> * </sup></label>
        <input
          id='courseTitle'
          placeholder='Enter Course Title'
          {...register("courseTitle", {required:true})}
          className='w-full form-style'
        />
        {
          errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is Required</span>
          )
        }
      </div>

      <div>
        <label htmlFor='courseShortDesc' className='lable-style'>Course Description <sup className='text-pink-300'> *</sup></label>
        <textarea
          id='courseShortDesc'
          placeholder='Enter Course Description'
          {...register("courseShortDesc", {required:true})}
          className='min-h-[130px]  w-full form-style'
        />
        {
          errors.courseShortDesc && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Description is Required</span>
          )
        }
      </div>

      <div className='relative'>
        <label htmlFor='coursePrice' className='lable-style'>Course Price <sup className='text-pink-300'> * </sup></label>
        <input
          id='coursePrice'
          placeholder='Enter Course Price'
          {...register("coursePrice", {
            required:true,
            valueAsNumber:true,
            pattern: {
              value: /^(0|[1-9]\d*)(\.\d+)?$/,
            }
            })}
          className='w-full form-style !pl-10'
          
        />
        <HiOutlineCurrencyRupee className='absolute top-[50%] left-2 text-richblack-300' size={25}/>
        {
          errors.coursePrice && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is Required</span>
          )
        }
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor='courseCategory' className='lable-style'>Categories <sup className='text-pink-300'> *</sup></label>
        <select
          id='courseCategory'
          defaultValue=""
          {...register("courseCategory", {required:true})}
          className='form-style w-full'
        >
          <option value="" disabled>Choose a Category</option>
          {
            !loading && courseCategories.map((categories, index) => (
              <option key={index} value={categories?._id}>
                {categories?.name}
              </option>
            ))
          }
        </select>
        {
          errors.courseCategory && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Category is Required</span>
          )
        }
      </div>

      {/* Craete a custom component for handling tags */}
      <TagsField
        name="courseTags"
        label="Tags"
        placeholder="Enter Tags and press enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* Thumbnail component */}
      
      <Upload
        name="thumbnailImage"
        label="Course thumbnail"
        register={register}
        errors={errors}
        setValue={setValue}
        editData={editCourse ? course?.thumbnail : null}
      />

      <div>
        <label htmlFor='courseBenefits' className='lable-style'>Benefits of the course</label>
        <textarea
          id='courseBenefits'
          placeholder='Enter benefits of your course'
          {...register("courseBenefits", {required:true})}
          className='w-full min-h-[120px] form-style'
        />
        {
          errors.courseBenefits && (
            <span className="flex flex-col space-y-2">Benefits of the course are required</span>
          )
        }
      </div>

      {/* intructions / Requirements */}
      <RequirementField
        name="courseRequirements"
        label="Requirements / instructions"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      <div className='flex justify-end gap-x-2'>
        {
          editCourse && (
            <button
            onClick={() => dispatch(setStep(2))}
            className='flex items-center px-2 font-semibold rounded-md bg-richblack-300 text-richblack-900'
            >
              Continue Without Saving
            </button>
          )
        }
        <Iconbtn
          text={!editCourse ? "Next" : "Save Changes"}
          next={true}
          
        />
      </div>

    </form>
  )
}

export default CourseInformationForm