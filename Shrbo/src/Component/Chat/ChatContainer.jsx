import React, { useState, useRef, useEffect } from "react";
import johnDoe from "../../assets/johnDoe.png";
import { Link } from "react-router-dom";
import cancelButton from "../../assets/svg/close-line-icon.svg";
import sendButton from "../../assets/svg/direction-arrow-top-icon.svg";
import ChatErrorModal from "./ChatErrorModal";
import emailValidator from "email-validator";
import Axios from "../../Axios"

export default function ChatContainer() {
  const [inputMessage, setInputMessage] = useState(""); // State to store the input message
  const [messages, setMessages] = useState([
    {
      text: "Hello there!",
      user: "User 1",
      date: "2023-09-11",
      time: "10:39 am",
      isUser1: true,
      image: johnDoe,
    },
    {
      text: "Hi, how can I help you?",
      user: "User 2",
      date: "2023-09-11",
      time: "10:45 am",
      isUser1: false,
      image: johnDoe,
    },

    {
      text: "I have a question about something.",
      user: "User 1",
      date: "2023-09-11",
      time: "11:02 am",
      isUser1: true,
      image: johnDoe,
    },
    {
      text: "Sure, go ahead and ask your question.",
      user: "User 2",
      date: "2023-09-11",
      time: "11:05 am",
      isUser1: false,
      image: johnDoe,
    },
    {
      text: "Ok",
      user: "User 2",
      date: "2023-09-11",
      time: "11:05 am",
      isUser1: false,
      image: johnDoe,
    },
    {
      text: "Pls do you have an apartment in dubai?",
      user: "User 2",
      date: "2023-09-11",
      time: "11:05 am",
      isUser1: false,
      image: johnDoe,
    },
  ]);

  const [reservationMessage, setReservationsMessages] = useState([
    // Your existing messages
    {
      // text: "John requests to reserve your apartment with the apartment name and timeline for how long they will stay.",
      user: "User 2",
      date: "2023-09-11",
      time: "11:10 am",
      isUser1: false,
      image: johnDoe,
      timeline:"3 days",
      houseTitle:"2b Admiralty way",
      isReservationRequest: true, // Add a flag to identify it as a reservation request
    },
    // Your other messages
  ]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [consecutiveNumbersCount, setConsecutiveNumbersCount] = useState(0); // Define consecutiveNumbersCount

  const handleOpenErrorModal = (message) => {
    setErrorMessage(message);
    setIsErrorModalOpen(true);
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  // Function to scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Use useEffect to scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const paymentDetails = {
    nightlyRate: "$108.00",
    numberOfNights: 2,
    subtotal: "$216.00",
    serviceFee: "$30.49",
    total: "$246.49",
  };

  const tripDetails = {
    checkInDate: "Dec 27, 2022",
    checkOutDate: "Dec 29, 2022",
    numberOfGuests: "7 adults",
  };

  const host = {
    hostImage: cancelButton,
    hostName: "username",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    console.log("Opening modal"); // Added log

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal"); // Added log

    setIsModalOpen(false);
  };

  // Function to handle form submission
  // Function to handle form submission
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Define regular expressions for link and phone number detection
    const linkRegex = /(http[s]?:\/\/[^\s]+)/;
    // const comRegex = /(\.com|com)/i;
    const invalidWordsRegex = /\b(one|two|o-ne|t-wo)\b/i;
    const phoneRegex = /\b\d{4,}\b/;
    const containsNumber = /^(\d,\s)*\d$/;
    const hasNumber = /\d+/;
    const addressRegex = /\b\d{1,5}\s\w+\s\w+\b/i;
    const passwordKeywords = ["password", "secret", "passcode"];
    const sensitiveKeywords = [
      "confidential",
      "private",
      "sensitive",
      "bvn",
      "address",
      "sensitive",
    ];

    for (const keyword of sensitiveKeywords) {
      if (inputMessage.toLowerCase().includes(keyword)) {
        console.log("Sensitive keyword error");
        handleOpenErrorModal(
          "Sensitive information is not allowed in messages."
        );
        return; // Do not send the message if it contains a sensitive keyword
      }
    }

    for (const keyword of passwordKeywords) {
      if (inputMessage.toLowerCase().includes(keyword)) {
        console.log("Password-related error");
        handleOpenErrorModal(
          "Password-related information is not allowed in messages."
        );
        return; // Do not send the message if it contains a password-related keyword
      }
    }

    if (addressRegex.test(inputMessage)) {
      console.log("Address error");
      handleOpenErrorModal("Personal addresses are not allowed in messages.");
      return; // Do not send the message if it contains a personal address
    }

    // Function to check for more than 3 consecutive numbers
    const hasConsecutiveNumbers = (text) => {
      const consecutiveNumbersRegex = /\d{4,}/;
      return consecutiveNumbersRegex.test(text);
    };

    if (linkRegex.test(inputMessage)) {
      console.log("Link error");
      handleOpenErrorModal("Links are not allowed in messages.");
      return; // Do not send the message if it contains a link
    }

    // if (comRegex.test(inputMessage)) {
    //   console.log("Link error");
    //   handleOpenErrorModal("Links are not allowed in messages.");
    //   return; // Do not send the message if it contains a link
    // }

    if (phoneRegex.test(inputMessage)) {
      console.log("Phone number error");
      handleOpenErrorModal("Phone numbers are not allowed in messages.");
      return; // Do not send the message if it contains a phone number
    }

    if (invalidWordsRegex.test(inputMessage)) {
      console.log("Invalid words error");
      handleOpenErrorModal("Words are not allowed in messages.");
      return; // Do not send the message if it contains invalid words
    }

    // Check for more than 3 consecutive numbers
    if (hasConsecutiveNumbers(inputMessage)) {
      if (consecutiveNumbersCount >= 3) {
        console.log("Consecutive numbers error");
        handleOpenErrorModal(
          "You've exceeded the limit of consecutive numbers."
        );
        return; // Do not send the message if it contains more than 3 consecutive numbers
      } else {
        setConsecutiveNumbersCount(consecutiveNumbersCount + 1);
        handleOpenErrorModal(
          "You've exceeded the limit of consecutive numbers."
        );

        console.log("Consecutive numbers detected:", inputMessage);
      }
    } else {
      // Reset the consecutive numbers count if the message doesn't contain consecutive numbers
      setConsecutiveNumbersCount(0);
    }

    if (hasNumber.test(inputMessage)) {
      console.log("Number detected in the text");
      // You can perform further actions here if a number is detected in the inputMessage.
    } else {
      console.log("No number detected in the text");
      // You can handle the case where no number is detected in the inputMessage.
    }

    const containsEmail = (text) => {
      const words = text.split(" ");
      for (const word of words) {
        if (emailValidator.validate(word)) {
          return true;
        }
      }
      return false;
    };

    if (containsEmail(inputMessage)) {
      console.log("Email address error");
      handleOpenErrorModal("Email addresses are not allowed in messages.");
      return; // Do not send the message if it contains an email address
    }
    // Create a new message object for the user's input
    const newMessage = {
      text: inputMessage,
      user: "User 1",
      date: "2023-09-11",
      time: new Date().toLocaleTimeString(),
      isUser1: true,
      image: johnDoe,
    };

    // Update the messages state by appending the new message
    setMessages([...messages, newMessage]);

    // Clear the input field
    setInputMessage("");

    scrollToBottom();
  };


  useEffect(() => {
    const token = localStorage.getItem('tokens');
    const receiverId = localStorage.getItem('receiverid');

    const fetchMessages = async () => {
      try {
        const response = await Axios.get(`/chat/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data.messagesWithAUser);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [receiverId]);


  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="h-[70vh]">
      {isModalOpen && (
        <div className="modal fixed flex justify-center items-center inset-0 z-[9999]">
          <div
            className="fixed bg-black inset-0 opacity-50 z-10"
            onClick={handleCloseModal}
          ></div>
          <div className="modal-content bg-white w-full md:w-1/2 z-50 p-4">
            <header className="flex items-center py-4">
              <div className=" flex justify-end ml-5">
                <button onClick={handleCloseModal} className="w-6">
                  <img src={cancelButton} alt="" />
                </button>
              </div>
              <div className="mx-auto">
                <h2 className="text-2xl">Details</h2>
              </div>
            </header>

            <div className="property-listing overflow-auto h-[70vh]">
              <div className="property-listing-container flex flex-wrap   ">
                <div className="property-listed--1  h-1/2  m-5 w-full">
                  <div className="property-listed--image__container relative">
                    <div className="image__status absolute bg-white border-2 p-2">
                      Available
                    </div>

                    <div className="image">
                      <img
                        src="https://a0.muscache.com/im/pictures/miso/Hosting-761451869585880202/original/87ced3f9-56d9-412a-a0f6-e0697f9b67e5.jpeg?aki_policy=large"
                        className="w-full md:h-[50vh] object-cover "
                        alt=""
                      />
                    </div>

                    <div className="property-info-details flex justify-between w-full md:w-3/4">
                      <div>Check in</div>
                      <div>Dec 27, 2022</div>
                    </div>
                  </div>
                </div>
                <div className="property-listed--2 m-5 w-full md:w-full">
                  <header className="text-2xl">Trip Details</header>
                  <div>
                    <p className="">
                      Well crafted to perfection with impeccable art
                    </p>
                  </div>
                  <div className="property-location text-gray-400 text-sm border-b-[1px] py-4">
                    Lekki, Lagos, NG
                  </div>

                  <div className="property-info-details flex items-center justify-between py-4 text-gray-500 border-b-[1px]">
                    <div>{host.hostName}</div>
                    <div>
                      <img
                        src="https://a0.muscache.com/im/pictures/user/24f4c560-4586-4eaf-bfef-06164ab677b4.jpg?aki_policy=profile_x_medium"
                        className="w-10 object-cover rounded-full"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                    <div>Check-in</div>
                    <div>{tripDetails.checkInDate}</div>
                  </div>
                  <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                    <div>Check-out</div>
                    <div>{tripDetails.checkOutDate}</div>
                  </div>
                  <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                    <div>Guests</div>
                    <div>{tripDetails.numberOfGuests}</div>
                  </div>
                </div>
              </div>
              <div className="property-listed--3 m-5">
                <header className="text-2xl">Payment details</header>

                <div className="payment-details-info w-full md:w-full">
                  <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                    <div>Rate per night</div>
                    <div>{paymentDetails.nightlyRate}</div>
                  </div>
                  <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                    <div>Number of nights</div>
                    <div>{paymentDetails.numberOfNights}</div>
                  </div>
                  <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                    <div>Subtotal</div>
                    <div>{paymentDetails.subtotal}</div>
                  </div>
                  <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                    <div>Shbro service fee</div>
                    <div>{paymentDetails.serviceFee}</div>
                  </div>
                  <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                    <div>Total</div>
                    <div>{paymentDetails.total}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <header className="py-1 px-4  items-center border-b-[1px] ">
          <div className="flex justify-between items-center">
            <span className=" text-xl">User 1</span> <br />
            <span className="text-sm text-gray-400">Response time: 1 hour</span>
          </div>
          <div>
            <button onClick={handleOpenModal}>see housing details</button>
          </div>
        </header>
        <div className="chats">
          {isErrorModalOpen && (
            <ChatErrorModal
              isOpen={isErrorModalOpen}
              errorMessage={errorMessage}
              onClose={handleCloseErrorModal}
            />
          )}
          <div
            className="chat--conversations h-[60vh] overflow-auto border-b-[1px]"
            ref={chatContainerRef}
          >
            <div className="rounded-lg p-4 mb-10">
            {messages.map((message, index) => (
        <div
          key={index}
          className={`${
            message.isUser1
              ? "bg-gray-300 text-white"
              : "bg-orange-400 text-white"
          } rounded-full p-2 mb-7 text-sm md:m-10`}
        >
          <div className="flex space-x-4">
            {message.image && (
              <img
                src={message.image}
                alt={`${message.user}'s Image`}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}

            <div>
              <span className="flex">{message.date}</span>
              {message.user}: {message.message}
              <div className="text-xs">time: {message.updated_at}</div>
            </div>
          </div>
        </div>
      ))}
            </div>

            <div className=" mb-10 p-4">
              {reservationMessage.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.isUser1
                      ? "bg-gray-300 text-white"
                      : "bg-orange-400 text-white"
                  }  p-5 mb-7 text-sm md:m-10`}
                >
           <Link to="/">
           <div className="flex space-x-4 my-4">
              <img
              src={message.image}
              alt={`${message.username}'s profile`}
              className="w-14 h-14 object-cover rounded-full "
            />
                  <button className="my-4">See Guest Profile</button>
              </div>
           </Link>

                  {message.isReservationRequest ? (
                    <div className="reservation-request">
                      {message.text}
                     <p>
                      {message.user} requests to  reserve your apartment  at {message.houseTitle} scheduled for 
                      {message.timeline}
                     </p>
                      <div className="text-xs">time: {message.time}</div>
                      {/* You can add a button or other UI elements for the host to respond to the reservation request */}
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      {message.image && (
                        <img
                          src={message.image}
                          alt={`${message.user}'s Image`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}

                      <div>
                      <span className="flex">{message.date}</span>

                        <span className="flex">{message.date}</span>
                        {message.user}: {message.text}
                        <div className="text-xs">time: {message.time}</div>
                      </div>
                    </div>
                  )}
                  <form action=""></form>
                  <div className=" flex justify-between py-4">
                    <button className="bg-white text-black py- px-4 rounded-full">
                      Accept
                    </button>
                    <button className="bg-black p-4 rounded-full">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="send-texts mt-2 z-[999] pt-8 bg-white fixed md:relative left-0 right-0 bottom-0">
            <form
              onSubmit={handleSubmit}
              className=" w-full md:w-3/4  mx-auto flex justify-center p-2"
            >
              <input
                type="text"
                placeholder="Type a message"
                className="bg-gray-200 rounded-full place-content-center pl-4"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-4  ml-2 rounded-full"
              >
                <img src={sendButton} className="w-4  rotate-45" alt="" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
