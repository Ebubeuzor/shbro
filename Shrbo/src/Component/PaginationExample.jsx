import React from 'react'
import leftArrow from "../assets/svg/angle-circle-left-icon.svg"
import rightArrow from "../assets/svg/angle-circle-right-icon.svg"


export default function PaginationExample() {
  return (
    <div>
        <div className='flex justify-center space-x-3'>
            <span>
                <img src={leftArrow} className='w-10 cursor-pointer' alt="" />
            </span>
            <span>
                <img src ={rightArrow} className='w-10 cursor-pointer' alt="" />
            </span>
        </div>
    </div>
  )
}
