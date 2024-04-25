import React from 'react'
import {FaArrowRight} from "react-icons/fa"
import { Link } from 'react-router-dom'
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAbutton from "../components/core/HomePage/Button"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import Footer from '../components/common/Footer'
import ReviewSlider from '../components/common/ReviewSlider'

const Home = () => {
  return (
    <div className=''>
        {/********** Section 1  **********/}
        <div className='relative px-2 lg:px-0  mx-auto flex flex-col w-[390px]  lg:w-11/12 max-w-maxContent lg:items-center
        text-white gap-8 lg:justify-between'>
            
            <Link to={"/signup"}>

                <div className='group mt-8 lg:mt-16 p-1 w-fit flex flex-row  mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                transition-all duration-200 hover:scale-95  [box-shadow:0px_-1px_0px_0px_#FFFFFF2E_inset]'>
                    <div className='flex flex-row  items-center gap-2 rounded-full px-10 py-[5px]
                    transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight/>
                    </div>
                </div>
            </Link>

            <div className='lg:text-center text-3xl lg:text-4xl font-semibold '>
                Empower Your Future with {" "}
                <HighlightText text={"Coding Skills"}/>
            </div>

            <div className='mt-3 w-[90%] lg:text-center text-lg font-inter font-bold text-richblack-300   '>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>

            <div className='flex flex-row justify-center gap-8 mt-10'>
                <CTAbutton active={true} linkto={"/signup"}>
                    Learn More
                </CTAbutton>

                <CTAbutton active={false} linkto={"/login"}>
                    Book a Demo
                </CTAbutton>
            </div>
            
            <div className='mx-3 my-10 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
                <video
                className="shadow-[20px_20px_rgba(255,255,255)]"
                muted
                loop
                autoPlay
                >
                <source src={Banner} type='video/mp4'/>
                </video>
            </div>

            {/* Code section 1 */}
            <div>
                <CodeBlocks
                    position={" flex flex-col lg:flex-row"}
                    heading={
                        <div className=' text-4xl lg:text-4xl font-semibold'>
                            Unlock Your {" "} 
                            <HighlightText text={"coding potentials"}/>
                            {" "}with our online courses
                        </div>
                    }
                    subheading={
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }
                    ctabtn1={
                        {
                            btnText: "try it yourself",
                            linkto: "/signup",
                            active: true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText: "learn more",
                            linkto: "/login",
                            active: false,
                        }
                    }
                    codeblock={`<!DOCTYPE html>\n<html>\nhead><>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>\n`}
                    codeColor={"text-yellow-25"}
                    backgroundGradient={<div className="codeblock1 absolute"></div>}
                />
            </div>

            {/* Code section 2 */}
            <div>
                <CodeBlocks
                    position={"flex flex-col lg:flex-row-reverse"}
                    heading={
                        <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                            Start  {" "}  
                            <HighlightText text={"coding "}/> <br/>
                            <HighlightText text={"in seconds"}/>
                            {" "} 
                        </div>
                    }
                    subheading={
                        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    }
                    ctabtn1={
                        {
                            btnText: "Continue Lesson",
                            linkto: "/signup",
                            active: true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText: "learn more",
                            linkto: "/login",
                            active: false,
                        }
                    }
                    codeblock={`<!DOCTYPE html>\n<html>\nhead><>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>\n`}
                    codeColor={"text-white"}
                    backgroundGradient={<div className="codeblock2 absolute"></div>}
                    // backgroundGradient={"w-[292px] h-[152px] rounded-full bg-gradient-to-r from-cyan-5 via-cyan-25 to-cyan-50 opacity-10"}
                />
            </div>

            <ExploreMore/>
            
        </div>

        
        {/********** Section 2  **********/}
        <div className='bg-pure-greys-5  text-richblack-700 '>
            <div className='homepage_bg h-[320px]'>
                
                <div className='w-[370px] lg:w-11/12 max-w-maxContent flex h-full items-center gap-5 mx-auto '>

                    <div className='flex flex-row gap-7 text-white mx-auto'>
                        <CTAbutton active={true} linkto={"/signup"}>
                           <div className='flex gap-3 items-center'>
                                Explore Full Catalog
                                <FaArrowRight/>
                           </div>
                           
                        </CTAbutton>

                        <CTAbutton active={false} linkto={"/"}> 
                            Learn more
                        </CTAbutton>

                    </div>
                </div>
            </div>

            <div className='mx-auto w-[390px] lg:w-11/12 max-w-maxContent flex flex-col items-center gap-7 justify-between'>
                
                <div className='flex flex-col w-fit lg:flex-row gap-5 justify-between mb-10 mt-3 lg:mt-24'>
                    <div className='font-inter font-semibold w-[358px] lg:w-[519px] text-4xl'>
                        Get the skills you need for a {" "}
                        <HighlightText text={"job that is in demand"}/>
                    </div>
                    <div className='flex flex-col gap-10 w-[358px] lg:w-[519px] items-start'>
                        <div className='font-inter font-medium text-base'>
                           The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>
                        <CTAbutton active={true} linkto={"/signup"}>
                            Learn More
                        </CTAbutton>
                    </div>
                </div>

                <TimelineSection/>

                <LearningLanguageSection/>
            </div>

            

        </div>

        {/********** Section 3  **********/}
        <div className='relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
            
            <InstructorSection/>

            <h1 className='lg:text-center text-4xl font-semibold mt-8'>
                Reviews from other learners
            </h1>
            <ReviewSlider/>
        </div>

        {/********** Footer  **********/}
        
        <Footer/>
    </div>
  )
}

export default Home