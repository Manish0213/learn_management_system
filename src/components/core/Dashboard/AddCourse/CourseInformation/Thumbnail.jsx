import React, { useEffect, useRef, useState } from 'react'
import { SlCloudUpload } from "react-icons/sl";

const Thumbnail = ({name, label, register, errors, setValue}) => {

    const fileInputRef = useRef(null)
    const [imageFile, setImageFile] = useState(null)
    const [previewSource, setPreviewSource] = useState(null)

    const handleClick = () => {
        fileInputRef.current.click();
    }

 
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setImageFile(file)
            previewFile(file)

        }
    } 

    const previewFile = (file) => {
        const reader = new FileReader() 
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }

    useEffect(() => {
        if(imageFile) {
            previewFile(imageFile)
        }
    }, [imageFile])

    useEffect(() => {
        register(name, {
            required:true,
        })
    },[])

    const handleCancelButton = () => {
        setImageFile(null);
        setPreviewSource(null);
    }

    useEffect(() => {
        if(imageFile) {
            setValue(name, imageFile)
        }
        
    },[imageFile])

  return (
    <div>
        <label htmlFor={name} className='lable-style'>{label} <sup className='text-pink-300'>*</sup></label>
        <div className='relative w-full form-style min-h-[270px]'>
            <input
                type='file'
                name={name}
                ref={fileInputRef}
                accept='image/png, image/gif, image/jpeg'
                className='w-full form-style min-h-[300px] cursor-pointer hidden'
                onChange={handleFileChange}
            />
            {
                !imageFile && (
                    <div className=' cursor-pointer w-full h-full flex flex-col justify-center font-inter items-center mt-10'>
                        <SlCloudUpload className='w-10 h-10 p-2  text-yellow-50 bg-richblack-900 rounded-full ' onClick={handleClick} />
                        
                            <p className='text-sm text-richblack-400 mt-3' >Drag and drop an image, or  </p>
                            <p className='text-sm text-richblack-400 mt-1'>click to <span className='text-yellow-50'> Browse</span> a file</p>
                            <ul className='text-sm text-richblack-400 font-semibold flex gap-14 mt-7 list-disc'>
                                <li>Aspect ratio 16:9</li>
                                <li>Recommended size 1024x576</li>
                            </ul>
                    </div>
                )
            }
            {
                previewSource && (
                    <img src={previewSource}
                    alt='Thumbnail Preview'
                    className='absolute top-0 left-0 p-5 rounded-lg w-full h-[87%] object-fit' 
            />
                )
            }
            <div>
                {
                    previewSource && (
                    <button
                    onClick={handleCancelButton}
                    className='absolute top-[88%] left-[45%] text-richblack-400 underline'
                    >
                        Cancel
                    </button>
                )}
            </div>
            {
                errors[name] && (
                    <span className='text-white'>
                        {label} is required
                    </span>
                )
            }

        </div>
        
    </div>
  )
}

export default Thumbnail