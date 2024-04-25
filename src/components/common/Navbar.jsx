import React, { useEffect, useState } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, matchPath} from 'react-router-dom'
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {AiOutlineShoppingCart} from "react-icons/ai"
import { ProfileDropDown } from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import {IoIosArrowDown} from "react-icons/io"
import { BurgerButton } from './BurgerButton'


const Navbar = () => {

    const {token} = useSelector( (state) => state.auth );
    const {user} = useSelector( (state) => state.profile );
    const {totalItems} = useSelector( (state) => state.cart );
    const location = useLocation();

    const [ssubLinks, setSsubLinks] = useState([]);
    const [loading, setLoading] = useState(false)

    const fetchSublinks = async() => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("Printing sublinks: ", result);
            setSsubLinks(result.data.data);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect( () => {
        setLoading(true)
        fetchSublinks();
        setLoading(false)
    }, [] )


    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }

    return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
>
        <div className='flex w-[360px] lg:w-11/12 max-w-maxContent items-center justify-between'>
            {/* IMAGE */}
            <Link to="/">
                <img src={logo} width={160} height={42} className=' w-[130px] lg:w-[160px]' loading='lazy' alt='logo' />
            </Link>

            {/* Nav Links */}
            <nav className=' hidden lg:block w-0 lg:w-fit'>
                <ul className='flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map( (link, index) => (
                            <li key={index}>
                                {
                                    link.title === "Catalog" ? (
                                        <div className=' relative group z-100 flex gap-2 items-center'>
                                            <p>{link.title}</p>
                                            <IoIosArrowDown/>

                                            <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg
                                             bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible 
                                             group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]"'>
                                                <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5'>    
                                                </div>
                                                {   loading ? (
                                                    <p className='text-center'>Loading...</p>
                                                ) :
                                                    ssubLinks.length ? (
                                                        ssubLinks.map((ssubLink, index) => (
                                                            <Link to={`/catalog/${ssubLink.name.split(" ").join("-").toLowerCase()}`} 
                                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                            key={index}>
                                                                <p>
                                                                    {ssubLink.name}
                                                                </p>
                                                            </Link>
                                                        ))
                                                    ) : (<div className='text-center'>No courses Found</div>)
                                                    
                                                }

                                            </div>
                                        </div>
                                        ) 
                                        : 
                                        (
                                        <Link to={link?.path}>
                                            <p className={`${ matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                                {link.title}
                                            </p>
                                
                                        </Link>
                                    )
                                }
                            </li>
                        ))
                    } 

                </ul>
            </nav>


            {/* LOGIN / SIGNUP / DASHBOARD */}
            <div className='flex gap-x-4 items-center'>
                    {
                        user && user?.accountType !== "Instructor" && (
                            <Link to="/dashboard/cart" className='relative'>
                                <AiOutlineShoppingCart className='text-2xl text-richblack-100'/>
                                {
                                    totalItems > 0 && (
                                        <span className='absolute -top-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100'>
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <div>
                                <div className='hidden lg:block space-x-4'>
                                    <Link to="/login">
                                        <button className=' border border-richblack-700 bg-richblack-800  text-richblack-100 py-[4px] px-[12px] rounded-md'>
                                            Log in
                                        </button>
                                    </Link>

                                    <Link to="/signup">
                                        <button className=' border border-richblack-700 bg-richblack-800   text-richblack-100 py-[4px] px-[12px] rounded-md'>
                                            Sign Up
                                        </button>
                                    </Link>
                                </div>
                                <div className='block lg:hidden'>
                                    <BurgerButton/>
                                </div>
                            </div>

                            
                        )
                    }
                    

                    {/* {
                        token === null && <BurgerButton/>
                    } */}
                    {
                        token !== null && <ProfileDropDown /> 
                    }
            </div>


        </div>
    </div>
  )
}

export default Navbar