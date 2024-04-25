import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import CountryCodes from "../../data/countrycode.json";
import { apiConnector } from '../../services/apiconnector';
import { contactusEndpoint } from '../../services/apis';

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    useEffect(() => {
        if(isSubmitSuccessful) {
            reset({
                email:"",
                firstname:"",
                lastname:"",
                message:"",
                phonenumber:"",
            })
        }
    }, [reset, isSubmitSuccessful])

    const submitContactForm = async(data) => {
        console.log("Logging data", data)
        try {
            setLoading(true);
            const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
            console.log("Loging Response", response)
            setLoading(false);
        } catch (error) {
            console.log("Error:", error.message);
            setLoading(false);
        }
    }

    return (
    <form onSubmit={handleSubmit(submitContactForm)} className='lg:w-[460px] mx-auto'>

        <div className='flex flex-col lg:flex lg:flex-row gap-5 w-full'>
            {/* First name */}
            <div className='flex flex-col'>
                <label className='mb-2 text-[0.875rem] text-left leading-[1.375rem] text-richblack-5' htmlFor='firstname'>First Name</label>
                <input
                    type='text'
                    name='firstname'
                    id='firstname'
                    placeholder='Enter first name'
                    style={{
                         boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                    className='rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
                    {...register("firstname", {required:true})}
                />
                {
                    errors.firstname && (
                        <span>
                            Please enter your name
                        </span>
                    )
                } 
            </div>
            
            {/* Last name */}
            <div className='flex flex-col'> 
                <label className='mb-2 text-[0.875rem] text-left leading-[1.375rem] text-richblack-5' htmlFor='lastname'>Last Name</label>
                <input 
                    type='text'
                    name='lastname'
                    id='lastname'
                    placeholder='Enter last name'
                    style={{
                         boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                    className='rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
                    {...register("lastname", {required:true})}
                />
                {
                    errors.lastname && (
                        <span>
                            Please enter your last name
                        </span>
                    )
                }
            </div>
        </div>

        {/* email */}
        <div className='flex flex-col mt-8'>
                <label className='mb-2 text-[0.875rem] text-left leading-[1.375rem] text-richblack-5' htmlFor='email' >Email</label>
                <input
                    type='email'
                    placeholder='Enter your email'
                    name='email'
                    id='email'
                    style={{
                         boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                    className=' rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
                    {...register("email", {required:true})}
                />
                {
                    errors.email && (
                        <span>
                            Please enter your email 
                        </span>
                    )
                }
            </div>

            {/* phone number */}
            <div className='flex flex-col mt-8'>
                <label className='mb-2 text-[0.875rem] text-left leading-[1.375rem] text-richblack-5' htmlFor='phonenumber'>Phone Number</label>
                <div className='flex gap-5'>
                    <select
                        style={{
                         boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className=' rounded-[0.5rem] bg-richblack-800 p-[12px] w-[70px] text-richblack-5'
                        name='country'
                        id='country'
                        {...register("country", {required:true})}
                    >
                    {
                        CountryCodes.map((countries, index) => (
                            <option key={index} value={countries.code} className='text-richblack-5 bg-transparent bg-richblack-900 '
                            // style={{ backgroundColor: 'transparent', color: '#000' }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#FF512F'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                {countries.code} - 
                                {" "}{ countries.country}
                            </option>
                        ))
                    }
                    </select>

                    <input
                        type='number'
                        name='phonenumber'
                        id='phonenumber'
                        placeholder='1234567890'
                        style={{
                         boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
                        {...register("phonenumber", 
                        {
                            required:{value:true, message:"Please enter phone number"},
                            maxLength:{value:10, message:"Invalid phone number"},
                            minLength:{value:8, message:"Invalid phone number"} })}
                    />
                </div>
                {
                        errors.phonenumber && (
                            <span>
                                {errors.phonenumber.message}
                            </span>
                        )
                    }
            </div>

            {/* Message box */}
            <div className='flex flex-col mt-8'>
                <label className='mb-2 text-[0.875rem] text-left leading-[1.375rem] text-richblack-5' htmlFor='message'>Message</label>
                <textarea
                    name='message'
                    id='message'
                    cols="30"
                    rows='3'
                    placeholder='Enter your message'
                    {...register("message", {required:true})}
                    style={{
                         boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                    className=' rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
                />
                {
                    errors.message && (
                        <span>
                            Please enter your message
                        </span>
                    )
                }
            </div>

            

            {/* button */}
            <button className='bg-yellow-50 mt-8 mb-10 text-[16px] px-6 py-3 rounded-md font-semibold w-full text-richblack-900 [box-shadow:-2px_-2px_0px_0px_rgba(255,_255,_255,_0.51)_inset] hover:scale-95 transition-all duration-200' type='submit'>
                Send Message
            </button>
    </form>
  )
}

export default ContactUsForm