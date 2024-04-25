import React from 'react'
import ContactDetails from '../components/core/ContactUs.jsx/ContactDetails';
import ContactForm from '../components/core/ContactUs.jsx/ContactForm';
import Footer from '../components/common/Footer';
import ReviewSlider from '../components/common/ReviewSlider';

const Contact = () => {
  

  return (
    <div>
        <div className='w-[360px] lg:w-11/12 mx-auto max-w-maxContent mt-10 lg:mt-20 flex flex-col justify-between gap-10 text-richblack-5 lg:flex-row'>
            {/* Contact Details */}
            <div className='lg:w-[40%]'>
                <ContactDetails/>
            </div>
            {/* Contact Form */}
            <div className='lg:w-[60%]'>
                <ContactForm/>
            </div>
        </div>
        <div className="relative mx-auto my-20 flex w-[360px] lg:w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
            {/* Review from learners */}
            <h1 className='text-center text-4xl font-semibold mt-8 '>
                Reviews from other learners
            </h1>
            {/* Review slider */}
            <ReviewSlider/>
        </div>
        <Footer/>
    </div>
  )
}

export default Contact