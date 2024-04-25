import React from 'react'
import { FiArrowRight, FiEdit } from 'react-icons/fi'

const Iconbtn = ({
    text,
    active,
    onclick,
    children,
    disabled,
    outline=false,
    customClasses,
    type,
    next,
}) => {
  return (
    <button
        className={`flex items-center  ${
          outline ? "border border-t-yellow-50 border-white bg-transparent" : "bg-yellow-50"
        } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`}
        disabled={disabled}
        onClick={onclick}
        type={type}
        
    >
        {
            children ? (
                <>
                    <span className={`${outline && "text-yellow-50"}`}>
                        {text}
                    </span>
                    {children}

                </>
            ) : (text)
            
        }
        {
            active ? <FiEdit/> : ""
        }
        {
            next ? <FiArrowRight/> : ""
        }
    </button>
  )
}

export default Iconbtn