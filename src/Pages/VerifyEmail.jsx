import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OTPInput from 'react-otp-input';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp, signUp } from '../services/operations/authAPI';
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { BsArrowRepeat } from "react-icons/bs";

const VerifyEmail = () => {
    const {signupData, loading} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    useEffect( () => {
        if(!signupData) {
            navigate("/signup");
        }
    },[])

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = signupData;
        dispatch(signUp(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate))
    }

    
  return (
    <div className=' translate-y-[50%] flex justify-center items-center'>
        {
            loading ? (
                <div>
                    loading...
                </div>
            ) : (
                <div className='w-[360px] lg:w-[400px] flex flex-col justify-center '>
                    <h1 className=' text-richblack-5 font-semibold font-inter text-[24px]'>Verify Email</h1>
                    <p className='text-richblack-200 font-inter font-normal text-[16px] mt-2'>A verification code has been sent to you. Enter the code below</p>
                    <form onSubmit={handleOnSubmit} className='flex flex-col '>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span className=' mr-3'>-</span>}
                            renderInput={(props) => <input {...props} placeholder='-'  
                                        className='bg-richblack-800 mt-4  rounded-[0.5rem] text-richblack-5  w-full py-[8px] px-[17px] lg:px-[21px]'
                                        style={{
                                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                        }}    
                            />}
                        />
                        <button type='submit' className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6'>
                            Verify Email 
                        </button>
                    </form>

                    <div className='flex justify-between items-center mt-4'>
                        <div>
                            <Link to="/login">
                                <p className='text-richblack-5 text-[16px] font-inter font-medium  flex items-center gap-2'><HiOutlineArrowNarrowLeft size={22} />Back to login</p>
                            </Link>
                        </div>
                        
                        <button className='text-blue-300 flex gap-2 items-center' onClick={() =>  dispatch(sendOtp(signupData.email, navigate))}>
                            <BsArrowRepeat />
                            Resend it
                        </button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail