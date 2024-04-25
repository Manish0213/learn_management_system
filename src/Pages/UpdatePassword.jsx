import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authAPI';
import { Link, useLocation } from 'react-router-dom';
import {AiOutlineEye , AiOutlineEyeInvisible } from "react-icons/ai"
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

const UpdatePassword = () => {
  const [showPassword, setShoowPassword] = useState(false);
  const [ShowconfirmPasssword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password:"",
    confirmPasssword:"",
  })
  const {password, confirmPassword} = formData;

  const {loading} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
        ...prevData,
        [e.target.name] : e.target.value,
    }))
  }
  const handleOnSubmi = (e) => {
    e.preventDefault();
    const token = location.pathname.split('/').at(-1);
    dispatch(resetPassword(password,confirmPassword, token))
  }
    return (
    <div className=' translate-y-[50%] flex justify-center items-center'>
        {
            loading ? (
                <div>
                    Loading...
                </div>
            ) : (
                <div className='w-[400px] flex flex-col justify-center '>
                    <h1 className=' text-richblack-5 font-semibold font-inter text-[24px]'>
                        Choose new password
                    </h1>
                    <p className='text-richblack-200 font-inter font-normal text-[16px] mt-2'>
                        Almost done. Enter your new password and youre all set.
                    </p>
                    
                    <form onSubmit={handleOnSubmi} className='flex flex-col'>
                        <label className='w-full relative'>
                        <p className='text-richblack-5 font-inter font-normal text-[14px] mt-3'>New Password <sup className='text-pink-200'>*</sup></p>
                            <input
                                required
                                placeholder='Enter Password'
                                type= {showPassword ? 'text' : 'password'}
                                value={password}
                                name='password'
                                onChange={handleOnChange}
                                style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                }}
                                className='bg-richblack-800 mt-2 rounded-[0.5rem] text-richblack-5 w-full py-[8px] px-[12px]'
                            />
                            <span className='absolute right-3 translate-y-[57%] z-10 cursor-pointer' onClick={() => setShoowPassword( (prev) => !prev)}>
                                {
                                    showPassword ? (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>) : (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />)
                                }
                            </span>
                        </label>
                        <label className='w-full relative'>
                            <p className='text-richblack-5 font-inter font-normal text-[14px] mt-3'>Confirm New Password <sup className='text-pink-200'>*</sup></p>
                            <input
                                required
                                placeholder='Confirm Password'
                                type={ ShowconfirmPasssword ? 'text' : 'password'}
                                value={confirmPassword}
                                name='confirmPassword'
                                onChange={handleOnChange}
                                style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                }}
                                className='bg-richblack-800 mt-2 rounded-[0.5rem] text-richblack-5 w-full py-[8px] px-[12px]'
                            />
                            <span onClick={() => setShowConfirmPassword((prev) => !prev)} className='absolute right-3 translate-y-[57%] z-10 cursor-pointer'>
                                {
                                    ShowconfirmPasssword ? (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>) : (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />)
                                }
                            </span>
                        </label>

                        <button type='submit' className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6'>
                            Reset Password
                        </button>
                    </form>

                    <div className='flex'>
                        <Link to="/login">
                            <p className='text-richblack-5 text-[16px] font-inter font-medium mt-3 flex items-center gap-2'><HiOutlineArrowNarrowLeft size={22} />Back to login</p>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword
