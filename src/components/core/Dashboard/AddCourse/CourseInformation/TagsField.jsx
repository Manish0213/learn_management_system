import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"


const TagsField = ({name, label,placeholder, register, errors, setValue, getValues}) => {
    const {editCourse, course} = useSelector((state)=> state.course)
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')

    useEffect(() => {
        if(editCourse) {
            console.log(course)
            setTags(course?.tags)
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
    }, [])

    const handleInputChange = (e) => {
        setTagInput(e.target.value);
    }

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    }

    const addTag = () => {
        const trimmedTag = tagInput.trim();
        if(trimmedTag !== '') {
            setTags([...tags, trimmedTag]);
            setTagInput('');
        }
    }

    const handleRemoveTag = (index) => {
        const updatedTags = [...tags]
        updatedTags.splice(index,1);
        setTags(updatedTags);
    }

    useEffect(() => {
        setValue(name,tags)
    },[tags, name, setValue])
  
    return (
    <div>
        <label htmlFor={name} className='lable-style'>{label} <sup className='text-pink-300'> *</sup></label>
        <input
            type='text'
            name={name}
            value={tagInput}
            placeholder={placeholder}
            className='form-style w-full'
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
        />
        <div className='flex w-full flex-wrap gap-3 mt-2  '>
            {
                tags.map((tag, index) => (
                    <span key={index} className='m-1 flex items-center rounded-full bg-yellow-900 px-2 py-1 text-sm text-yellow-50'>
                        {tag}
                        <button onClick={() => handleRemoveTag(index)} className='text-pink-600 ml-3 focus:outline-none'>x</button>
                    </span>
                ))
            }
        </div>
        {
            errors[name] && (
                <span>
                    {label} are required **
                </span>
            )
        }
    </div>
  )
}

export default TagsField