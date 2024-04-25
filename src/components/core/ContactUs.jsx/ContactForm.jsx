import React from 'react'
import ContactUsForm from '../../common/ContactUsForm'

const ContactForm = () => {
  return (
    <div className='flex flex-col gap-[3px] p-7 lg:p-[67px] font-inter border-richblack-600 border rounded-xl'>
        <header className='text-richblack-5 font-semibold text-[32px] leading-10'>
        Got a Idea? We&apos;ve got the skills. Let&apos;s team up
        </header>
        <p className='text-richblack-300 text-base'>
        Tall us more about yourself and what you’re got in mind.
        </p>
        <div className='mt-7 '>
            <ContactUsForm/>
        </div>
        
    </div>
  )
}

export default ContactForm