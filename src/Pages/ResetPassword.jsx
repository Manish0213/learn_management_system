import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { getPasswordResetToken, getResetPassToken } from '../services/operations/authAPI';

const ResetPassword = () => {
    
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const {loading} = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
    }
  
    return (
    <div className=' translate-y-[50%] flex justify-center items-center'>
        {
            loading ? (<div>loading....</div>) : (
                <div className='w-[360px] lg:w-[450px] flex flex-col justify-center '>
                    <h1 className=' text-richblack-5 font-semibold font-inter text-[24px]'>
                        {
                            !emailSent ? "Reset your password" : "Check email" 
                        }
                    </h1>

                    <p className='text-richblack-200 font-inter font-normal text-[16px] mt-2'>
                        {
                            !emailSent ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery" : `We have sent the reset email to ${email}`
                        }
                    </p>

                    <form onSubmit={handleOnSubmit} className='flex flex-col'>
                        {
                            !emailSent && (
                                <label className=''>
                                    <p className='text-richblack-5 font-inter font-normal text-[14px] mt-3'>Email Address <sup className='text-pink-200'>*</sup></p>
                                    <input
                                        required
                                        placeholder='Enter your email'
                                        type='email'
                                        value={email}
                                        name='email'
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                        }}
                                        className='bg-richblack-800 mt-2 rounded-[0.5rem] text-richblack-5 w-full py-[8px] px-[12px]'
                                    />
                                </label>
                            )
                        }

                        <button type='submit' className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6'>
                            {
                                !emailSent ? "Reset Password" : "Resend Email"
                            }
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

export default ResetPassword