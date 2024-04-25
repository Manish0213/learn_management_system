import React from 'react'
import { useSelector } from 'react-redux'
import frameImg from "../../../assets/Images/frame.png"
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'

const Template = ({title, description1, description2, image, formType}) => {
    
    const {loading} = useSelector((state) => state.auth)

    return (
    <div className="grid min-h-[calc(100vh-3.5rem)] z-0  place-items-center">
        {
            loading ? (
                <div className='spinner'></div>
            ) : (
                <div className="lg:mx-auto flex w-[360px] lg:w-11/12  max-w-maxContent flex-col-reverse  justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
                    <div className="lg:mx-auto w-[360px] lg:w-11/12 max-w-[450px] md:mx-0">
                        <h1 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5'>
                            {title}
                        </h1>
                        <p className='mt-4 text-[1.125rem] leading-[1.625rem]'>
                            <span className=' text-richblack-100'>{description1}</span> {" "}
                            <span className=' text-blue-100 font-edu-sa font-bold italic'>{description2}</span>
                        </p>
                        {
                            formType === "signup" ? <SignupForm /> : <LoginForm/>
                        }
                    </div>

                    <div  className="relative hidden lg:block lg:mx-auto w-[360px] lg:w-11/12 max-w-[450px] md:mx-0">
                        <img 
                            src={frameImg}
                            alt='Pattern'
                            width={558}
                            height={504}
                            loading='lazy'
                        />
                        <img 
                            src={image}
                            alt='Students'
                            width={558}
                            height={504}
                            loading='lazy'
                            className='absolute -top-4 right-4 z-10'
                        />
                    </div>


                </div>
            )
        }
    </div>
  )
}

export default Template