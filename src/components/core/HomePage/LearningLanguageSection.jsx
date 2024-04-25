import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"
import CTAbutton from "./Button"

const LearningLanguageSection = () => {
  return (
    <div className='mt-3 lg:mt-[100px] mb-8 lg:mb-32'>
        <div className='flex flex-col gap-5 items-center'>

            <div className='text-4xl font-semibold lg:text-center'>
                Your swiss knife for {" "}
                <HighlightText text={" learning any language"}/> 
            </div>

            <div className='lg:text-center text-richblack-600 lg:mx-auto text-base lg:mt-3 mb-6 lg:w-[75%]'>
                Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

            <div className='flex flex-col lg:flex-row items-center justify-center '>
                <img 
                    src={know_your_progress}
                    alt='know_your_progress'
                    loading='lazy'
                    className='object-contain -mb-16 lg:-mr-32'
                />
                <img 
                    src={compare_with_others}
                    alt='compare_with_others'
                    loading='lazy'
                    className='object-contain -mb-20 lg:-mb-11'
                />
                <img 
                    src={plan_your_lesson}
                    alt='plan_your_lesson'
                    loading='lazy'
                    className='object-contain lg:-ml-36 lg:mb-7'
                />
            </div>
            
            <div className='w-fit mx-auto mt-7'> 
                <CTAbutton active={true} linkto={"/signup"} >
                    Learn More
                </CTAbutton>
            </div>
            
            

        </div>
    </div>
  )
}

export default LearningLanguageSection