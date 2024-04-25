import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';

const Dashboard = () => {

    const {loading: authLoading} = useSelector((state) => state.auth);
    const {loading: profileLOading} = useSelector((state) => state.profile);
    


    if(profileLOading || authLoading) {
        return (
            <div className='mt-16 text-richblack-5 font-bold text-2xl'>
                Loading...
            </div>
        )
    }

  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
        <Sidebar/>
        <div className='h-[calc(100vh-3.5rem)]  flex-1 overflow-auto'>
            <div className=' w-[360px] lg:w-11/12 mx-auto lg:max-w-[1000px] py-10'>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Dashboard 