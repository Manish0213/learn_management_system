import React from 'react'
import { VscTrash } from 'react-icons/vsc'
import { FiTrash2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteAccount } from '../../../../services/operations/SettingsAPI'

const DeleteProfile = () => {
    const {token} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleClick = (e) => {
        e.preventDefault()
        dispatch(deleteAccount(token, navigate))
    } 
  return (
    <>
        <div
        className='my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-3 py-5 lg:p-8 lg:px-12'
      >
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>
        <div className='flex flex-col space-y-2'>
            <h1 className='text-richblack-5 text-[18px] font-bold font-inter'>Delete Account</h1>
            <p className='text-[14px] font-medium font-inter text-pink-25 '>Would you like to delete account?</p>
            <p className='text-[14px] font-medium font-inter text-pink-25 '>This account contains Paid Courses. Deleting your account will remove all the contain associated with it.</p>
            <button
              className='text-[16px] text-left mt-2 italic font-semibold font-inter text-pink-300'
              onClick={handleClick}
            >
            I want to delete my account.
            </button>
        </div>  
      </div>
    </>
  )
}

export default DeleteProfile