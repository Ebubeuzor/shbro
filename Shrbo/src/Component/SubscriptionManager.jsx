import React from 'react'

export default function SubscriptionManager(props) {
  return (
    <div>
            <div className="">
          <h2 className="font-medium text-2xl">
            <label htmlFor="">{props.title}</label>
          </h2>
          <p className="text-gray-500">
         {props.paragraph}
          </p>
        </div>
    </div>
  )
}
