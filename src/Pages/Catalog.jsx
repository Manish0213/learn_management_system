import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/PageAndComponentData';
import Footer from '../components/common/Footer';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';

const Catalog = () => {

    const {catalogName} = useParams();
    const [categoryId, setCategoryId] = useState("");
    const [catalogPageData, setCatalogPageData] = useState(null)
    const [active, setActive] = useState(1)

    //Fetching all categories
    useEffect(() => {
        const getCategories = async() => {
            const response = await apiConnector("GET", categories.CATEGORIES_API);
            // console.log("RESPONSE OF GET CATEGORIES....", response)
            const category_id = response?.data?.data?.filter((category) => category.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            // console.log("CATEGORY ID.....", category_id);
            setCategoryId(category_id);
         }
         getCategories();
    },[catalogName])

    useEffect(() => {
        const getCategoryDetails = async () => {
            try {
                console.log("Category iD::",categoryId)
                const result = await getCatalogPageData(categoryId);
                console.log("PRINTING RESULT....",result)
                setCatalogPageData(result);
            } catch (error) {
                console.log(error)
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
    }, [categoryId]);

  return (
    <div className='text-richblack-5 box-content bg-richblack-800  '>
        <div className='mx-auto flex px-2 lg:px-0 min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent'>
            <p className='text-richblack-300 text-sm'>{`Home / Catalog /`} <span className='text-yellow-25'>{catalogPageData?.data?.selectedCategory?.name}</span></p>
            <p className='text-richblack-5 text-4xl'>{catalogPageData?.data?.selectedCategory?.name}</p>
            <p className='text-richblack-200 max-w-[870px]'>{catalogPageData?.data?.selectedCategory?.description}</p>
        </div>

        <div className='bg-richblack-900 '>
            {/* SECTION 1 */}
            <div className='mx-auto box-content lg:w-11/12 max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
                <div className=' text-4xl font-bold text-richblack-25'>Courses to get you started</div>
                <div  className="my-4 flex border-b border-b-richblack-600 text-base">
                    <p className={`px-4 py-2 ${active === 1 ? 'border-b border-b-yellow-25 text-yellow-25' : 'text-richblack-50'} cursor-pointer`} 
                       onClick={() => setActive(1)}>Most Popular</p>
                    <p className={`px-4 py-2 ${active === 2 ? 'border-b border-b-yellow-25 text-yellow-25' : 'text-richblack-50'} cursor-pointer`} 
                       onClick={() => setActive(2)}>New</p>
                </div>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
                </div>
            </div>

            {/* SECTION 2 */}
            <div  className=" mx-auto box-content  max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className='text-4xl font-bold text-richblack-25'>Top Courses in {catalogPageData?.data?.differentCategory?.name}</div>
                <div className='py-8'>
                    <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses} />
                </div>
            </div>

            {/* SECTION 3 */}
            <div className=' mx-auto box-content max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
                <div className='text-4xl font-bold text-richblack-25'>Frequently Bought</div>
                <div className='py-8'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                        {
                            catalogPageData?.data?.mostSellingCourses?.slice(0,4)
                            .map((course, i) => (
                                <Course_Card course={course} key={i} Height={"h-[300px]"} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Catalog