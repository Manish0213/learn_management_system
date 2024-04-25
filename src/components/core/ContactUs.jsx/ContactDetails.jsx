import React from 'react'
import * as Icon1 from 'react-icons/bi'
import * as Icon2 from 'react-icons/hi2'
import * as Icon3 from 'react-icons/io5'

const ContactDetails = () => {

    const details = [
        {
            icon: "HiChatBubbleLeftRight",
            heading: "Chat on us",
            message: "Our friendly team is here to help.",
            contact: "info@studynotion.com",
        },
        {
            icon: "BiWorld",
            heading: "Visit us",
            message: "Come and say hello at our office HQ.",
            contact: "Gera Imporium - I, Patto Panaji, Goa - 403001",
        },
        {
            icon: "IoCall",
            heading: "Call us",
            message: "Mon - Fri From 8am to 5pm",
            contact: "+123 456 7890",
        },
      ]

  return (
    <div className='flex flex-col gap-8 bg-richblack-800 rounded-xl p-4  lg:p-6'>
        {
            details.map((detail, index) => {
                let Icon = Icon1[detail.icon] || Icon2[detail.icon] || Icon3[detail.icon]
                return (
                    <div key={index} className='flex gap-3 text-sm text-richblack-200'>
                        <div className=''>
                            <Icon size={25} /> 
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <h1 className='text-[17px] font-inter font-semibold text-richblack-5'>
                                {detail.heading}
                            </h1>
                            <p className='font-inter font-medium'>{detail.message}</p>
                        <p className='font-inter font-medium'>{detail.contact}</p>
                        </div>
                    </div>
                )
            })
        }
    </div>
  )
}

export default ContactDetails