import React, { useState } from 'react'

const Accordion = ({Courses}) => {
    console.log("Accordion" , Courses)
    
    const [activeIndex, setActiveIndex] = useState(null)

    const clickHandler = (index) => {
        setActiveIndex(index === activeIndex ? null : index)
    }

  return (
    <div className='text-white'>
        <div>
            {
                Courses.map((course, index) => (
                    <div key={index} className='text-richblack-5'>
                        <div
                            className='cursor-pointer bg-richblack-700 w-full p-5 border-b-2 border-b-richblack-600'
                            onClick={() => clickHandler(index)}>
                            {course.subSection[0].title}
                        </div>
                        {
                            activeIndex === index && (
                                <div className='cursor-pointer bg-richblack-900 w-full p-6 border-2 border-richblack-700'>
                                    {course.subSection[0].description}
                                </div>
                            )
                        }
                    </div>
                ))
            }
        </div>
    </div>
  )  
}

export default Accordion