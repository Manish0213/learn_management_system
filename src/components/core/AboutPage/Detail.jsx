import React from 'react'
import HighlightText from '../HomePage/HighlightText'
import CTAbutton from "../HomePage/Button"

const Detail = () => {
  return (
    <section className='bg-richblack-900 mt-[70px] mb-[50px]'>
        <div className='w-360px lg:w-11/12 mx-auto max-w-maxContent '>
           <div className='grid lg:grid-cols-4 pl-2 lg:pl-0'>
                <div className=' col-span-2'>
                  <header className='font-inter  font-semibold text-[32px] leading-10'>
                  World-Class Learning for <HighlightText text={"Anyone, Anywhere"}/>
                  </header>
                  <p className='font-inter text-[16px] text-richblack-300 mt-4'>
                    Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.
                  </p>
                  <div className='flex mt-14 mb-4'>
                    <CTAbutton linkto={"/signup"} active={true}>
                        Learn More
                    </CTAbutton>
                  </div>
                </div>
                <div className='bg-richblack-700 p-6'>
                  <header className='text-[16px] font-inter font-semibold ' >
                    Curriculum Based on Industry Needs
                  </header>
                  <p className='font-inter text-[13px] text-richblack-100 mt-6'>
                    Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.
                  </p>
                </div>
                
                <div className='bg-richblack-800 p-6'>
                <header className='text-[16px] font-inter font-semibold ' >
                  Our Learning Methods
                  </header>
                  <p className='font-inter text-[13px] text-richblack-100 mt-6'>
                    The learning process uses the namely online and offline.
                  </p>
                </div>
                
                <div>
                  
                </div>
                
                <div className='bg-richblack-700 p-6 h-[267px]'>
                <header className='text-[16px] font-inter font-semibold ' >
                Certification
                  </header>
                  <p className='font-inter text-[13px] text-richblack-100 mt-6'>
                  You will get a certificate that can be used as a certification during job hunting.
                  </p>
                </div>
                
                <div className='bg-richblack-800 p-6'>
                <header className='text-[16px] font-inter font-semibold ' >
                Rating "Auto-grading"
                  </header>
                  <p className='font-inter text-[13px] text-richblack-100 mt-6'>
                  You will immediately get feedback during the learning process without having to wait for an answer or response from the mentor.
                  </p>
                </div>
                
                <div className='bg-richblack-700 p-6'>
                <header className='text-[16px] font-inter font-semibold ' >
                Ready to Work
                  </header>
                  <p className='font-inter text-[13px] text-richblack-100 mt-6'>
                  Connected with over 150+ hiring partners, you will have the opportunity to find a job after graduating from our program.
                  </p>
                </div>
           </div> 
        </div>
    </section>
  )
}

export default Detail