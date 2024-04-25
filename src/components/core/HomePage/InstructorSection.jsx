import React from 'react'
import instructor_image from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from "./Button"
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='mt-10 lg:mt-24'>
        <div className='flex flex-col-reverse lg:flex-row lg:items-center gap-0 lg:gap-20'>
            <div className=' lg:w-[50%]'>
                <img
                    src={instructor_image}
                    alt='instructor_image'
                    loading='lazy'
                    className='lg:[box-shadow:-20px_-20px_0px_0px_rgba(245,_245,_245,_1)]'
                />
                {/*  mobile button   */} 
                <div className='w-fit mt-16 visible lg:invisible'> 
                    <CTAButton active={true} linkto={"/signup"}>
                        <div className='flex flex-row items-center gap-2 '>
                            Start Teaching Today
                            <FaArrowRight/>
                        </div>
                    </CTAButton>
                </div>
            </div>
            <div className=' lg:w-[50%] flex flex-col gap-5 lg:gap-10'>
                <div className='text-3xl lg:text-4xl w-[50%] font-inter font-semibold'>
                    Become an {" "} 
                    <HighlightText text={"instructor"}/>
                </div>
                
                <p className=' text-[16px] lg:w-[80%] text-richblack-300 font-medium '>
                    Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </p>
                
                <div className='invisible lg:visible w-fit'> 
                    <CTAButton active={true} linkto={"/signup"}>
                        <div className='flex flex-row items-center gap-2 '>
                            Start Teaching Today
                            <FaArrowRight/>
                        </div>
                    </CTAButton>
                </div>    
                    
                
            </div>
        </div>
    </div>
  )
}

export default InstructorSection