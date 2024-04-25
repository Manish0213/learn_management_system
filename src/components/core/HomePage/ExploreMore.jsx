import React from 'react'
import HighlightText from './HighlightText';
import {HomePageExplore} from "../../../data/homepage-explore";
import { useState } from 'react';
import CourseCard from './CourseCard';

const tabName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skill paths",
    "Career paths",
];

const ExploreMore = () => {

  const [currentTab, setCurrentTab] = useState(tabName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter( (course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);    
  }


  return (
    <div>
        <div className='font-semibold text-3xl  lg:text-4xl lg:text-center font-inter mt-7  lg:mt-16'>
            Unlock the {" "}
            <HighlightText text={"Power of Code"}/>
        </div>

        <p className='font-inter font-medium lg:text-center  mt-3 text-richblack-300 text-base -mb-24  lg:mb-0'>
         Learn to Build Anything You Can Imagine
        </p>

        <div className='hidden lg:flex lg:flex-row bg-richblack-800 rounded-full p-[5px] gap-2 mb-8 mt-8 lg:border lg:border-richblack-700'>
          {
            tabName.map( (element, index) => {
              return(
                <div className={`text-[16px] flex items-center gap-2 
                ${currentTab === element 
                ? "bg-richblack-900 text-richblack-5 font-medium" 
                : "text-richblack-200 "} rounded-full  transition-all duration-200 cursor-pointer
                hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                
                key={index}
                onClick={ () => setMyCards(element)}>
                  {element}
                </div>
              )
            })
          }
        </div>

        <div className=' lg:h-[250px]'>
        </div>

        {/* courses card group */}
        <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] translate-y-[13%] lg:translate-y-[25%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
          {
            courses.map( (element, index) => {
              return(
                <CourseCard 
                key={index}
                cardData={element}
                currentCard={currentCard}
                setCurrentCard={setCurrentCard} 
                />
              )
            })
          }
        </div>
    </div>
  )
}

export default ExploreMore