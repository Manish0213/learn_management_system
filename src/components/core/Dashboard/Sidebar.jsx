import React, { useState } from 'react'

import { sidebarLinks } from '../../../data/dashboard-links'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../../services/operations/authAPI'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../../common/ConfirmationModal'

const Sidebar = () => {
    
    const{user, loading: profileLOading} = useSelector((state) => state.profile)
    const {loading: authLoading} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [confirmationModal, setConfirmationModal] = useState(null);
    if(profileLOading || authLoading) {
        return (
            <div className='mt-16 text-richblack-5 font-bold text-2xl'>
                Loading...
            </div>
        )
    }


    return (
    <div className='text-white hidden lg:block'>
        <div className='flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 h-[calc(100vh-3.5rem)] bg-richblack-800 py-10'>
            
            <div className='flex flex-col text-richblack-800'>
                {
                    sidebarLinks.map((link) => {
                        if(link.type && user?.accountType !== link.type) return null;
                        return (
                            <SidebarLink key={link.id} link={link} iconName={link.icon} />
                        )
                        
                    })
                }

            </div> 

            <div className='mx-auto w-10/12 h-[1px] bg-richblack-600 mt-6 mb-6'></div>

            <div className='flex flex-col '>
                <SidebarLink
                    link={{name:"Settings", path:"dashboard/settings"}}
                    iconName="VscSettingsGear"
                />

                <button
                    onClick={ () => setConfirmationModal({
                        text1: "Are you Sure?",
                        text2: "You will be logged out of your account",
                        btn1Text: "Logout",
                        btn2Text: "Cancel",
                        btn1Handler: () => dispatch(logout(navigate)),
                        btn2Handler: () => setConfirmationModal(null),
                    })}
                    className='text-richblack-50 text-sm'
                >

                    <div className='flex gap-x-2 items-center px-8 py-2 font-inter text-sm font-medium text-richblack-300 '>
                        <VscSignOut className='text-lg'/>
                        <span className=' '>Log Out</span>
                    </div>
                </button>

            </div>
        </div>

        {confirmationModal && <ConfirmationModal modalData={confirmationModal} /> }
    </div>
  )
}

export default Sidebar