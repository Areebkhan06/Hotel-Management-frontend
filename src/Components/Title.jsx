import React from 'react'

const Title = ({title1,title2}) => {
  return (
    <div className="flex flex-col items-center mb-10 text-center">
    <p className="text-4xl font-semibold">{title1} {title2}</p>
    <div className="w-24 h-0.5 bg-amber-600 mt-1 rounded-full"></div>
  </div>
  )
}

export default Title
