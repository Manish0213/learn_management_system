import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({children, linkto, active}) => {
  return (
    <Link to={linkto}>

        <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold 
        ${active ? "bg-yellow-50 text-black [box-shadow:-2px_-2px_0px_0px_rgba(255,_255,_255,_0.51)_inset]" : "bg-richblack-800 [box-shadow:-2px_-2px_0px_0px_rgba(255,_255,_255,_0.18)_inset]"}
        hover:scale-95 transition-all duration-200`}>
            {children}
        </div>
    </Link>
  )
}

export default Button