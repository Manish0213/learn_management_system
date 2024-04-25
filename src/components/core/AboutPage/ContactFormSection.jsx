import React from 'react'
import ContactUsForm from '../../common/ContactUsForm'

const ContactFormSection = () => {
  return (
    <section className='w-full text-center mt-[100px] p-1.5 lg-p-0'>
        <div >
            <h1 className='font-inter font-semibold text-[34px] mb-2'>
                Get in Touch
            </h1>
            <p className='font-inter text-[16px] text-richblack-300 mb-10'>
             We’d love to here for you, Please fill out this form.
            </p>
            <div >
                <ContactUsForm/>
            </div>
        </div>
    </section>
  )
}

export default ContactFormSection