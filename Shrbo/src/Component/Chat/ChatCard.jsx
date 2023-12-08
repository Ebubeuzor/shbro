import React from "react";
import johnDOe from "../../assets/johnDoe.png"

const messages = [
  {
    image: johnDOe,
    username: "User 1  Request WithdrawnRequest Withdrawn",
    text: "Hello!",
    status: "Request Withdrawn",
    date: "Oct 22 - 27, 2023",
    location: "Lagos"
  },
  {
    image: johnDOe,
    username: "User 2",
    text: "Hi there! theretheretheretheretheretheretherethere",
    status: "Unavailable",
    date: "Sept 22 - 27, 2023",
    location: "Oyo"


  },

  {
    image: johnDOe,
    username: "User 2",
    text: "Hi there! theretheretheretheretheretheretherethere",
    status: "Unavailable",
    date: "Sept 22 - 27, 2023",
    location: "Oyo"


  },

  {
    image: johnDOe,
    username: "User 2",
    text: "Hi there! theretheretheretheretheretheretherethere",
    status: "Unavailable",
    date: "Sept 22 - 27, 2023",
    location: "Oyo"


  },
  {
    image: johnDOe,
    username: "User 2",
    text: "Hi there! theretheretheretheretheretheretherethere",
    status: "Unavailable",
    date: "Sept 22 - 27, 2023",
    location: "Oyo"


  },

  {
    image: johnDOe,
    username: "User 2",
    text: "Hi there! theretheretheretheretheretheretherethere",
    status: "Unavailable",
    date: "Sept 22 - 27, 2023",
    location: "Oyo"


  },
  {
    image: johnDOe,
    username: "User 2",
    text: "Hi there! theretheretheretheretheretheretherethere",
    status: "Unavailable",
    date: "Sept 22 - 27, 2023",
    location: "Oyo"


  },

  {
    image: johnDOe,
    username: "User 2",
    text: "Hi there! theretheretheretheretheretheretherethere",
    status: "Unavailable",
    date: "Sept 22 - 27, 2023",
    location: "Oyo"


  },
  {
    image: johnDOe,
    username: "User 2",
    text: "Hi there! theretheretheretheretheretheretherethere",
    status: "Unavailable",
    date: "Sept 22 - 27, 2023",
    location: "Oyo"


  },

  {
    image: johnDOe,
    username: "User 2",
    text: "Hi there! theretheretheretheretheretheretherethere",
    status: "Unavailable",
    date: "Sept 22 - 27, 2023",
    location: "Oyo"


  },
];

export default function ChatCard() {
  return (
    <div className="rounded-lg pb-56  mx-3">
        <div className="border-b-[1px] py-4 border-gray-100">
            <h1 className="text-3xl">Messages</h1>
        </div>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex  cursor-pointer  items-center mb-4 mt-4 border-b-[1px] border-gray-100 ${
            index % 2 === 0 ? "justify-end" : "justify-start"
          }`}
        >
          <div className="w-16 h-16 rounded-full ">
            <img
              src={message.image}
              alt={`${message.username}'s profile`}
              className="w-full h-full object-cover rounded-full "
            />
          </div>
          <div className="ml-2 flex-1 conversation overflow-auto">
            <div className="bg-white p-2 rounded-lg">
              <p className="font-normal whitespace-nowrap overflow-ellipsis overflow-hidden">{message.username}</p>
              <p className="whitespace-nowrap overflow-ellipsis overflow-hidden ">
                {message.text}
              </p>{" "}
            <div className="flex whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-400 text-sm ">
            <p className="whitespace-nowrap overflow-ellipsis overflow-hidden mr-2">{message.status}</p>
              <p className="whitespace-nowrap overflow-ellipsis overflow-hidden">{message.date}</p>
            </div>
            <p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-400 text-sm font-thin">{message.location}</p>


            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
