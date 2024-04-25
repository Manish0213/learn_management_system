import React, { useEffect, useState } from 'react'
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {Autoplay, FreeMode, Pagination} from "swiper/modules"
import ReactStars from 'react-rating-stars-component'
import {ratingsEndpoints} from "../../services/apis"
import { apiConnector} from "../../services/apiconnector"
import { FaStar } from "react-icons/fa"



const ReviewSlider = () => {

    const [reviews, setReviews] = useState([])
    const truncateWords = 15;

    useEffect(() => {
        const fetchAllReviews = async() => {
            const response = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
            console.log("Rating API...", response)

            if(response?.data?.success) {
                setReviews(response?.data?.data)
            }
            console.log("Printing Data for reviews", reviews)
        }
        fetchAllReviews();
    },[])
  return (
    <div className='text-white w-11/12 '>
        <div className='my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent '>
            <Swiper
                slidesPerView={1}
                spaceBetween={24}
                loop={true}
                freeMode={true}
                autoplay={{
                    delay: 2500,
                }}
                breakpoints={{
                        1024: {
                            slidesPerView: 4,
                        },
                    }}
                modules={[FreeMode, Pagination, Autoplay]}
                className='w-full'
            >
                {
                    reviews.map((review, index) => {
                        return (
                        <SwiperSlide key={index} >
                            <div className='flex flex-col gap-3 bg-richblack-800 p-3 h-[200px] text-[14px] text-richblack-25 '>
                            <div className='flex items-center gap-4'>
                                <img
                                src={reviews?.user?.images ? reviews?.user?.images : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                                alt='Profile-Pic'
                                className='h-9 w-9 object-cover rounded-full'
                                />
                                <div className='flex flex-col'>
                                    <h1 className='font-semibold text-richblack-5'>{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                                    <h2 className="text-[12px] font-medium text-richblack-500">{review?.user?.email}</h2>
                                </div>
                            </div>
                            <p className="font-medium text-richblack-25">
                            {review?.review.split(" ").length > truncateWords ? 
                            `${review?.review
                            .split(" ")
                            .slice(0, truncateWords)
                            .join(" ")} ...`
                            : `${review?.review}`}
                            </p>
                            <div className="flex items-center gap-2 ">
                                <h3 className="font-semibold text-yellow-100">
                                    {review.rating.toFixed(1)}
                                </h3>
                                <ReactStars
                                    count={5}
                                    value={review.rating}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<FaStar />}
                                    fullIcon={<FaStar />}

                                />

                            </div>
                            </div>
                        </SwiperSlide>
                    )
                    })
                }
            </Swiper>
        </div>
    </div>
  )
}

export default ReviewSlider