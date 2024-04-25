import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Iconbtn from '../../common/Iconbtn'


const MyProfile = () => {

  const {user} = useSelector((state) => state.profile)
  const {token} = useSelector((state) => state.auth)
  console.log("user..", user);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  // const handleOnClick = (e) => {
  //   e.preventDefault();
  //   dispatch(deleteAccount(token, navigate));
  // }
  
  return (
    <div className='text-richblack-5 p-2 lg:p-0  '>
      <h1 className='font-inter lg:mb-14 text-3xl font-medium lg:mt-2 text-richblack-5'>
        My Profile
      </h1>

      {/* Section 1 */}
      <div className='bg-richblack-800  mt-8 p-3 py-5 lg:p-8 lg:px-12 rounded-md border-[1px] border-richblack-700 flex justify-between items-center'
      style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
      >
        <div className='flex gap-x-4 items-center'>
          <img 
            src={user?.images}
            alt={`profile-${user?.firstName}`}
            className='aspect-square w-[58px] object-cover rounded-full'
          />
          <div className='font-inter leading-6'>
            <p className='text-richblack-5 lg:text-[17px] font-semibold'> {user?.firstName + " " + user?.lastName }</p>
            <p className='text-richblack-500 text-[12px] lg:text-[14px] font-medium'> {user?.email} </p>
          </div>
        </div>
        <Iconbtn
          active={true} 
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
        />
      </div>
      
      {/* section 2 */}
      <div
        className='my-10 flex flex-col gap-y-3 lg:gap-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-3 py-5 lg:p-8 lg:px-12 '
        style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
      >
        <div className='flex justify-between items-center '>
          <p className='text-richblack-5 text-[18px] font-semibold font-inter'>About</p>
          <Iconbtn 
            active={true}
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          />
        </div>
        <p className={`${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-sm font-medium`}>{user?.additionalDetails?.about ?? "Write about yourself"}</p>
      </div>

      {/* Section 3 */}
      <div
        className='my-10 flex flex-col gap-y-3 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-3 py-5 lg:p-8 lg:px-12'
        style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
      >
          <div className='flex justify-between items-center'>
            <p className='text-richblack-5 text-[18px] font-semibold font-inter'>Personal Details </p>
            <Iconbtn
            active={true} 
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          />
          </div>

          <div className='grid grid-rows-3 grid-flow-col mt-4 gap-y-2 font-inter leading-7'>

          <div className='font-inter leading-7'>
            <p className='text-richblack-600 text-[14px] font-medium '>First Name</p>
            <p className='text-richblack-5 text-[14px] font-medium'>{user?.firstName}</p>
          </div>
          <div className='font-inter leading-7'>
            <p className='text-richblack-600 text-[14px] font-medium '>Email</p>
            <p className='text-richblack-5 text-[14px] font-medium'>{user?.email}</p>
          </div>
          <div className='font-inter leading-7'>
            <p className='text-richblack-600 text-[14px] font-medium '>Gender</p>
            <p className='text-richblack-5 text-[14px] font-medium'>{user?.additionalDetails?.gender ?? "Add Gender"}</p>
          </div>
          <div className='font-inter leading-7'>
            <p className='text-richblack-600 text-[14px] font-medium '>Last Name</p>
            <p className='text-richblack-5 text-[14px] font-medium'>{user?.lastName}</p>
          </div>
          
          <div>
            <p className='text-richblack-600 text-[14px] font-medium '>Phone Number</p>
            <p className='text-richblack-5 text-[14px] font-medium'>{user?.additionalDetails?.contactNumber ?? "Add contact number"} </p>
          </div>
          <div>
            <p className='text-richblack-600 text-[14px] font-medium '>Date of Birth</p>
            <p className='text-richblack-5 text-[14px] font-medium'>{user?.additionalDetails?.dayeOfBirth ?? "Add Date of Birth"}</p>
          </div>
          </div>
          
      </div>

      {/* Section 4 */}
      {/*  */}
    
    </div>
  )
}

export default MyProfile