import React, { useRef, useState } from 'react'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from 'react-router-dom';
import { MdChecklistRtl } from "react-icons/md";
import { SiMinutemailer } from "react-icons/si";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdLogin } from "react-icons/md";
import { VscSignIn } from "react-icons/vsc";

export const BurgerButton = () => {

    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useOnClickOutside(ref, () => setOpen(false))

    return (
    <button className='relative ' onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-1">
            <GiHamburgerMenu className='text-3xl text-richblack-50 font-bold'/>
        </div>
        {
            open && (
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute w-[150px] top-[130%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
                    ref={ref}
                >
                    <Link to="/catalog/web-development" onClick={() => setOpen(false)}>
                        <div className='flex w-full items-center font-semibold font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 border-[1px] border-richblack-700 hover:bg-richblack-700 hover:text-richblack-25'>
                            <MdChecklistRtl className='text-lg'/>
                            Catalog
                        </div>
                    </Link>
                    <Link to="/about" onClick={() => setOpen(false)}>
                        <div className='flex w-full items-center font-semibold border-b-[1px] border-richblack-700 font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                            <IoIosInformationCircleOutline className='text-lg'/>
                            About
                        </div>
                    </Link>
                    <Link to="/contact" onClick={() => setOpen(false)}>
                        <div className='flex  w-full items-center font-semibold border-b-[1px] border-richblack-700 font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                        <SiMinutemailer className='text-lg'/>
                            Contact Us
                        </div>
                    </Link>
                    <Link to="/login" onClick={() => setOpen(false)}>
                        <div className='flex w-full  items-center font-semibold font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                            <MdLogin className='text-lg'/>
                            Login
                        </div>
                    </Link>
                    <Link to="/signup" onClick={() => setOpen(false)}>
                        <div className='flex w-full border-[1px] border-richblack-700 items-center font-semibold font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                            <VscSignIn className='text-lg'/>
                            Sign Up
                        </div>
                    </Link>
                </div>
            )
        }
    </button>
  )
}

