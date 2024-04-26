import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import { AiOutlineCaretDown } from 'react-icons/ai';
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { logout } from '../../../services/operations/authAPI';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { MdChecklistRtl } from "react-icons/md";
import { TiInputChecked } from "react-icons/ti";
import { IoMdSettings } from "react-icons/io";
import { MdCallMade } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

export const ProfileDropDown = () => {
  const {user} = useSelector((state) => state.profile)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  if(!user) return null

  return (
    <button className='relative ' onClick={() => setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <img
          src={user?.images}
          alt={`profile-${user?.firstname}`}
          className='aspect-square w-[30px] rounded-full object-cover'
        />
        <AiOutlineCaretDown className='text-sm text-richblack-100' />
      </div>
      {
        open && (
          <div onClick={(e) => e.stopPropagation()}
          className="absolute top-[120%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
          ref={ref}
          >
            <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
              <div className='flex w-full items-center font-semibold font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                <VscDashboard className="text-lg" />
                dashboard
              </div>
            </Link>
            
            {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                  <div className='block lg:hidden'>
                  <Link to="/dashboard/enrolled-courses" onClick={() => setOpen(false)}>
                    <div className='flex w-full items-center  border-b-[1px] border-b-richblack-700 font-semibold font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                      <TiInputChecked className='text-lg' />
                       courses
                    </div>
                  </Link>

                  <Link to="/catalog/web-development" onClick={() => setOpen(false)}>
                        <div className='flex w-full items-center font-semibold font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 border-[1px] border-richblack-700 hover:bg-richblack-700 hover:text-richblack-25'>
                            <MdChecklistRtl className='text-lg'/>
                            Catalog
                        </div>
                    </Link>

                  <Link to="/dashboard/settings" onClick={() => setOpen(false)}>
                    <div className='flex w-full items-center font-semibold font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                      <IoMdSettings className='text-lg' />
                       settings
                    </div>
                  </Link>
                  </div>
                  
              )
            }
            {
              user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                <div className='block lg:hidden'>
                <Link to="/dashboard/my-courses" onClick={() => setOpen(false)}>
                    <div className='flex w-full items-center  border-b-[1px] border-b-richblack-700 font-semibold font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                        <MdCallMade />
                       my course
                    </div>
                  </Link>

                  <Link to="/dashboard/add-course" onClick={() => setOpen(false)}>
                    <div className='flex w-full items-center  border-b-[1px] border-b-richblack-700 font-semibold font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                       <IoAddCircleOutline/>
                       add course
                    </div>
                  </Link>

                  <Link to="/dashboard/settings" onClick={() => setOpen(false)}>
                    <div className='flex w-full items-center font-semibold font-inter gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                      <IoMdSettings className='text-base' />
                       settings
                    </div>
                  </Link>
                </div>
              )
            }

            <div 
              onClick={() => {
                dispatch(logout(navigate))
                setOpen(false)
              }}
              className="flex w-full items-center gap-x-2 font-inter font-semibold py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
            > 
              <VscSignOut className='text-lg ' />
              Logout
            </div>
          </div>
        )
      }
    </button>
  )
}
