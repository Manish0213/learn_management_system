import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import {AiOutlineEye , AiOutlineEyeInvisible } from "react-icons/ai"
import { login } from '../../../services/operations/authAPI'

const LoginForm = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({ email:"", password: "",})

    const [showPassword, setShowPasssword] = useState(false)
    const {email, password} = formData

    const hanleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

        const handleOnSubmit = (e) => {
            e.preventDefault()
            dispatch(login(email,password,navigate));
        }


  return (
    <form onSubmit={handleOnSubmit} className='flex flex-col w-full gap-y-4 mt-6'>
        <label className='w-full'>
            <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                Email Addrress <sup className='text-pink-200'>*</sup>
            </p>
            <input 
                required
                type='email'
                name='email'
                value={email}
                onChange={hanleOnChange}
                placeholder='Enter your Email ID'
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
            />
        </label>
        
        <label className='w-full relative'>
            <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'> 
                password <sup className='text-pink-200'>*</sup>
            </p>
            <input 
                required
                name='password'
                type= {showPassword ? ("text") : ("password")}
                value={formData.password}
                onChange={hanleOnChange}
                placeholder='Enter your password'
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
            />
            <span className='absolute right-3 top-[38px] z-10 cursor-pointer'
                onClick={() => setShowPasssword( (prev) => ! prev)}>
                {
                    showPassword ? (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>) : (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />)
                }
            </span>

            <Link to={"/forget-password"}>
                <p className='text-xs mt-1 text-blue-100 max-w-max ml-auto'> 
                    Forget password 
                </p>
            </Link>
        </label>

        <button type='submit' className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6'>
            Sign In
        </button>
    </form>
  )
}

export default LoginForm