import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Iconbtn from '../../../common/Iconbtn'
import { editProfile } from '../../../../services/operations/SettingsAPI'

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile()  {
  const {user} = useSelector((state) => state.profile)
  const {token} = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm()

  const submitProfileForm = async(data) => {
    //console.log("Form Data ----  ", data)
    try {
      //console.log("Data -- ", data)
      dispatch(editProfile(token, data))
    } catch (error) {
      console.log("ERROR WHILE UPDATING DETAILS", error.message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>
          <div className='my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-3 py-5 lg:p-8 lg:px-12'>
            <h1 className='text-lg font-semibold text-richblack-5'>
              Profile Information
            </h1>
            <div className='flex flex-col gap-5 lg:flex-row'>
              <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='firstName' className='lable-style'>
                  First Name
                </label>
                <input
                  type='text'
                  name='firstName'
                  id='firstName'
                  placeholder='Enter first name'
                  className='form-style'
                  {...register("firstName", {required:true})}
                  defaultValue={user?.firstName}
                />
                {
                  errors.firstName && (
                    <span className='mt-1 text-[12px] text-yellow-100'>
                      Please enter your first name
                    </span>
                  )
                }
              </div>
              <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='lastName' className='lable-style'>
                  Last Name
                </label>
                <input
                  type='text'
                  name='lastName'
                  id='lastName'
                  placeholder='Enter last name'
                  className='form-style'
                  {...register('lastName', {required:true})}
                  defaultValue={user?.lastName}
                />
                {
                  errors.lastName && (
                    <span className='mt-1 text-[12px] text-yellow-100'>
                      Please enter your last name
                    </span>
                  )
                }
              </div>
            </div>

            <div className='flex flex-col gap-5 lg:flex-row'>
                <div className='flex flex-col gap-2 lg:w-[48%]'>
                  <label htmlFor='dayeOfBirth' className='lable-style'>
                    Date of Birth
                  </label>
                  <input
                    type='date'
                    name='dayeOfBirth'
                    id='dayeOfBirth'
                    className='form-style'
                    {...register("dayeOfBirth", {
                      required: {
                        value:true,
                        message: "Please enter your date of birth."
                      },
                      max: {
                        value: new Date().toISOString().split("T")[0],
                        message: "Date of birth cannot be in future."
                      },
                    })}
                    defaultValue={user?.additionalDetails?.dayeOfBirth}
                  />
                  {
                    errors.dayeOfBirth && (
                      <span className='-mt-1 text-[12px] text-yellow-100'>
                        {errors.dayeOfBirth.message}
                      </span>
                    )
                  }
                </div>
                <div className='flex flex-col gap-2 lg:w-[48%]'>
                  <label htmlFor='gender' className='lable-style'>
                    Gender
                  </label>
                  <select
                    type="text"
                    name='gender'
                    id='gender'
                    className='form-style '
                    {...register("gender", {required:true})}
                    defaultValue={user?.additionalDetails?.gender}
                  >
                    {
                      genders.map((ele,i) => {
                        return(
                          <option key={i} value={ele} >
                            {ele}
                          </option>
                        )
                      })
                    }
                  </select>
                  {
                    errors.gender && (
                      <spna className="-mt-1 text-[12px] text-yellow-100">
                        Please select gender
                      </spna>
                    )
                  }
                </div>
            </div>

            <div className='flex flex-col gap-5 lg:flex-row text-richblack-5'>
              <div className='flex flex-col gap-2 lg:w-[48%]'>
                  <label htmlFor='contactNumber' className='lable-style'>
                    Contact Number
                  </label>
                  <input
                    type='tel'
                    name='contactNumber'
                    id='contactNumber'
                    placeholder='Enter ypur contact Number'
                    className='form-style'
                    {...register("contactNumber", {
                      required: {
                        value: true,
                        message: "please enter your contact number"
                      },
                      maxLength: {
                        value: 12,
                        message: "Invalid contact number"
                      },
                      minLength: {
                        value: 10,
                        message: "Invalid contact number",
                      },
                    })}
                    defaultValue={user?.additionalDetails?.contactNumber}
                  />
                  {
                    errors.contactNumber && (
                      <span className='-mt-1 text-[12px] text-yellow-100'>
                        {errors.contactNumber.message}
                      </span>
                    )
                  }
              </div>
              <div className='flex flex-col gap-2 lg:w-[48%] text-richblack-5'>
                  <label htmlFor='about' className='lable-style'>
                    About
                  </label>
                  <input
                    type='text'
                    name='about'
                    id='about'
                    placeholder='Enter Bio Details'
                    className='form-style'
                    {...register("about",{required: true})}
                    defaultValue={user?.additionalDetails?.about}
                  />
                  {
                    errors.about && (
                      <span className='-mt-1 text-[12px] text-yellow-100'>
                        please write about yourself
                      </span>
                    )
                  }
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-2'>
              <button
              onClick={() => {
                navigate("/dashboard/my-profile")
              }}
              className='cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50'
              >
                Cancel
              </button>
              <Iconbtn text="save" type="submit" />
          </div>
      </form>
    </>
  )
}

