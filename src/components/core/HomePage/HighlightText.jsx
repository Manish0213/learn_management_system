import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className='font-bold bg-gradient-to-r from-cyan-5 via-cyan-25 to-cyan-50 inline-block text-transparent bg-clip-text'>
        
        {text}
        {"  "}
    </span>
  )
}

export default HighlightText