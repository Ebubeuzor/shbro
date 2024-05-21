import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faUser } from "@fortawesome/free-solid-svg-icons";

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import BottomNavigation from "../Navigation/BottomNavigation";
import { BsChevronBarLeft } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import Axios from "../../Axios";
import echo from "../../Real Time/echo";
import { format } from "date-fns";
import shbrologo from "../../assets/shbro logo.png";
import { message as antdMessage } from "antd";

import { Link } from "react-router-dom";
import { message as messages2 } from "antd";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentMessages, setRecentMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [newMessages, setNewMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const [selectedUserName, setSelectedUserName] = useState(null); // State to store the selected user's name
  const [selectedUserProfilePic, setSelectedUserProfilePic] = useState(null);
  const [users] = useState([]);
  const [hostId, setHostId] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showApprovalSection, setShowApprovalSection] = useState(true);
  const [receiverIds, setReceiverIds] = useState(null);
  const [loggedinuserid, setLoggedinuserid] = useState(null);

  const [selectedUserObj, setSelectedUserObj] = useState({});
  const [loadingUsersCard, setLoadingUsersCard] = useState(true);
  const [sending, setSending] = useState(false);
  const audioRef = useRef(null);
  const [approved, setApproved] = useState(null);

  const token = localStorage.getItem("tokens");

  console.log(token);

  const initializeEcho = (token, receiverId) => {
    if (typeof window.Echo !== "undefined") {
      const channelName = `messanger.${receiverId}`;

      window.Echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Authentication token is set:",
        window.Echo.connector.options.auth.headers.Authorization
      );

      const privateChannel = window.Echo.private(channelName);

      privateChannel.listen("MessageSent", (data) => {
        console.log("Received message:", data);
        console.log("User ID:", data.user_id);

        setRecentMessages(() => data.recentMessages);
        setIsTyping(false);

        setUserChats((prevChats) => {
          const newChats = { ...prevChats };
          if (!newChats[receiverId]) {
            newChats[receiverId] = [];
          }
          // console.log('New message:', newMessage);
          setNewMessages((prevMessages) => [
            ...prevMessages,
            data.messagesWithAUser[data.messagesWithAUser.length - 1],
          ]);

          // newChats[receiverId].push(newMessage);
          return newChats;
        });
      });

      console.log("Listening for messages on channel:", channelName);
    } else {
      console.error(
        "Echo is not defined. Make sure Laravel Echo is properly configured."
      );
    }
  };

  useEffect(() => {
    initializeEcho(token, receiverId);
  }, []);

  useEffect(() => {
    // Load the audio file
    audioRef.current = new Audio(
      "../src/notifcation sound/mixkit-bell-notification-933.wav"
    );
  }, []);

  const [userChats, setUserChats] = useState({});
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const sendMessage = async (msgType) => {
    if (!message.trim()) return; // Prevent sending empty messages

    try {
      setSending(true); // Set sending state to true

      const response = await Axios.post(
        `/chat/${selectedUser}`,
        { message: message.trim(), senderId: ADMIN_ID }, // Include senderId in the message object
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the userChats state with the new message
      const chat = userChats[selectedUser] || [];
      const now = new Date();
      const formattedTime = format(now, "EEEE, d MMMM yyyy 'at' HH:mm");

      const newChatItem = {
        text: message.trim(),
        sender: { id: ADMIN_ID },
        type: msgType,
        time: new Date(),
      };

      const newChat = [...chat, newChatItem];
      setUserChats({ ...userChats, [selectedUser]: newChat });

      // Update recentMessages to show the user you texted to at the top
      const updatedRecentMessages = recentMessages.filter(
        (msg) => msg.user_id !== selectedUser
      );
      const selectedUserMessage = {
        user_id: selectedUser,
        name: selectedUserName,
        profilePic: selectedUserProfilePic,
        message: { message: newChatItem.text },
      };
      const newRecentMessages = [selectedUserMessage, ...updatedRecentMessages];

      // Create a new array reference to force re-render
      setRecentMessages([...newRecentMessages]);
      console.log("check", selectedUserProfilePic);

      setMessage(""); // Clear the message input after sending
      setSelectedUser(selectedUser); // Set the selectedUser state to the receiverId
      setSending(false); // Reset sending state to false
    } catch (error) {
      console.error("Error sending message:", error);
      messages2.error(error.response.data.message);
      setSending(false); // Reset sending state to false in case of error
    }
  };

  const checkTyping = async () => {
    if (!isTyping) {
      // Send typing notification to the server
      await Axios.get(`/typing/${selectedUser}/${ADMIN_ID}`);
      // setIsTyping(true);
      console.log("typing....")

      // Initialize the typing echo after sending the typing notification
      // initializeTypingEcho(ADMIN_ID);
    }
  };

  useEffect(() => {




    if (selectedUser) {



      const cleanupTyping = initializeTypingEcho(ADMIN_ID);


      return () => {

        cleanupTyping();


      };
    }
  }, [selectedUser]);


  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);  // Adjust delay as necessary, 1000 ms = 1 second

      // Cleanup function to clear the timer when the component unmounts or updates
      return () => clearTimeout(timer);
    }
  }, [isTyping]);


  const initializeTypingEcho = (receiverId) => {
    const channelName = `typing.${receiverId}`;

    const privateChannel = window.Echo.private(channelName);

    const messageHandler = (data) => {
      if (!isTyping) {
        let message = data.message;
        let matchedText = message.match(/(.*)\s+is typing/);

        if (matchedText && matchedText.length > 1) {
          let collectedText = matchedText[1];
          console.log(collectedText===selectedUserName);

          if(collectedText===selectedUserName){
            setIsTyping(true);
            console.log("hhhhhh", data)

          }
        }
      }
    };

    privateChannel.listen("Typing", messageHandler);

    console.log("Listening for typing notifications on channel:", channelName);

    // Return a function to unsubscribe from the channel
    return () => {
      privateChannel.stopListening("Typing", messageHandler);
    };
  };







  const TypingIndicator = () => (
    <div className="flex items-center text-gray-500">
      <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
      <p>User is typing...</p>
    </div>
  );

  // Your existing code

  const handleTyping = (e) => {
    const message = e.target.value;
    setMessage(message);
    // setIsTyping(message.trim().length > 0);

  };

  const handleKeyUp = () => {

    if (selectedUser) {
      checkTyping();
    }


  }



  useEffect(() => {
    // Play the sound when new messages arrive
    if (newMessages.length > 0) {
      audioRef.current.play();
    }
  }, [newMessages]);

  const filteredUsers = users.filter((user) => {
    const nameMatch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const messageMatch = recentMessages.some(
      (message) =>
        message.name &&
        message.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return nameMatch || messageMatch;
  });

  const receiverId = parseInt(localStorage.getItem("receiverid"), 10);

  const ADMIN_ID = receiverId;

  useEffect(() => {
    const token = localStorage.getItem("tokens");
    const receiverId = localStorage.getItem("receiverid");

    const fetchMessages = async () => {
      try {
        const response = await Axios.get(`/chat/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserChats({ ...userChats, [receiverId]: response.data.messages });
        setRecentMessages(response.data.recentMessages);
        setLoadingUsersCard(false); // Set loading state to false after fetching users

        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [receiverId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Axios.get("/user");
        setHostId(response.data.id);
        setLoggedinuserid(response.data.id); // Set loggedinuserid state

        console.log(response.data.id);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error, show error message, etc.
      }
    };

    fetchUsers();
  }, []);

  console.log(loggedinuserid);

  const fetchUserChats = async (receiverId) => {
    try {
      setLoadingMessages(true); // Set loading state to true

      const response = await Axios.get(`/chat/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserChats({
        ...userChats,
        [receiverId]: response.data.messagesWithAUser,
      });
      setRecentMessages(response.data.recentMessages);
      setSelectedUser(receiverId); // Set the selectedUser state to the clicked user
      console.log(response.data.messagesWithAUser);
      console.log(response.data.receiver.name);
      setSelectedUserName(response.data.receiver.name); // Store the name of the selected user in state
      setSelectedUserProfilePic(response.data.receiver.profilePicture); // Store the profile picture of the selected user in state
      console.log(response);

      // Find the latest booking request
      let latestBookingRequest = null;
      response.data.messagesWithAUser.forEach((message) => {
        if (message.booking_request.length > 0) {
          const bookingRequest = message.booking_request[0];
          if (
            !latestBookingRequest ||
            new Date(bookingRequest.created_at) >
            new Date(latestBookingRequest.created_at)
          ) {
            latestBookingRequest = bookingRequest;
          }
        }
      });

      console.log("Latest Booking Request:", latestBookingRequest);

      // Set the selected user object with the latest booking request
      setSelectedUserObj({
        hostHomeId: latestBookingRequest?.host_home_id ?? "",
        requestId: latestBookingRequest?.id ?? "",
        message: latestBookingRequest?.message ?? "",
        name: latestBookingRequest?.userName ?? "", // Use userName
        profilePic: latestBookingRequest?.sender?.profile_picture_url ?? "", // Use sender profile pic
        userId: latestBookingRequest?.sender_id ?? "",
        approved: latestBookingRequest?.approved ?? "",
        receiverId: latestBookingRequest?.host_id ?? "",
      });
      setReceiverIds(latestBookingRequest.host_id); // Set host_ids state
      setApproved(latestBookingRequest.approved)
      console.log(latestBookingRequest.host_id);

      console.log("APPROVED " + latestBookingRequest.approved);
    } catch (error) {
      setLoadingMessages(false); // Set loading state to false if there's an error

      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false); // Set loading state to false when messages are loaded
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [userChats, newMessages]);

  const renderMessages = (userChats, newMessages, selectedUser, users) => {
    const userChat = userChats[selectedUser] || [];
    const noMessagesReceived =
      userChat.length === 0 && newMessages.length === 0;
    let messageCount = 1;

    if (noMessagesReceived && message.trim()) {
      const formattedTime = format(new Date(), "EEEE, d MMMM yyyy 'at' HH:mm");
      return (
        <div className="flex flex-row-reverse mb-2">
          <div className="bg-orange-100 w-fit text-blue-900 p-2 rounded">
            <p>{message}</p>
            <p className="text-xs text-gray-500">{formattedTime}</p>
          </div>
        </div>
      );
    }

    const handleBookingAction = async (
      requestId,
      hostHomeId,
      hostId,
      guestId,
      action
    ) => {
      console.log(requestId, hostHomeId, hostId, guestId, action);
      try {
        const response = await Axios.post(
          `/handleBookingRequest/${requestId}/${hostHomeId}/${hostId}/${guestId}/${action}`
        );
        console.log("Booking request handled successfully:", response.data);
        // Optionally, you can update your UI or state based on the response
      } catch (error) {
        console.error("Error handling booking request:", error);
        // Handle error scenarios, e.g., display an error message to the user
      }
    };

    const handleApprove = () => {
      console.log("Approve parameters:", {
        requestId: selectedUserObj.requestId,
        hostHomeId: selectedUserObj.hostHomeId,
        hostId: hostId,
        guestId: selectedUser,
        action: "accept",
      });

      handleBookingAction(
        selectedUserObj.requestId,
        selectedUserObj.hostHomeId,
        hostId,
        selectedUser,
        "accept"
      );
      antdMessage.success("Booking request approved successfully!");
      setShowApprovalSection(false);
    };

    const handleDecline = () => {
      handleBookingAction({
        requestId: selectedUserObj.requestId,
        hostHomeId: selectedUserObj.hostHomeId,
        hostId: hostId,
        guestId: selectedUser,
        action: "decline", // Corrected syntax for the action parameter
      });

      handleBookingAction(
        selectedUserObj.requestId,
        selectedUserObj.hostHomeId,
        hostId,
        selectedUser,
        "decline"
      );
      antdMessage.success("Booking request declined successfully!");
      setShowApprovalSection(false);
    };

    // const selectedUserProfilePic = selectedUserObj?.image;

    // Filter new messages to include only messages for the selected user
    const filteredNewMessages = newMessages.filter((msg) => {
      return msg.receiver_id === selectedUser || msg.sender_id === selectedUser;
    });

    const sortedMessages = [...userChat, ...filteredNewMessages].sort(
      (a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(a.time);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(b.time);

        return dateA - dateB;
      }
    );
    console.log(filteredNewMessages);

    const uniqueMessages = filteredNewMessages.filter((msg, index, self) => {
      // Check if there is a message with the same content and time earlier in the array
      const isDuplicate = self.slice(0, index).some((m) => {
        return m.message === msg.message && m.time === msg.time;
      });

      // Return true if the message is not a duplicate, false otherwise
      return !isDuplicate;
    });

    sortedMessages.forEach((msg) => {
      const existingMsg = uniqueMessages.find((m) => m.id === msg.id);
      if (!existingMsg) {
        uniqueMessages.push(msg);
      }
    });

    if (selectedUserObj) {
      console.log("User ID:", selectedUserObj.user_id);
      console.log("Receiver ID:", receiverIds);
    }

    return (
      <>
        {selectedUserObj && (
          <div className="flex items-center justify-center mb-4">
            <img
              src={selectedUserObj.profilePic || shbrologo}
              alt={selectedUserObj.name}
              className="w-10 h-10 rounded-full mr-2"
            />
          </div>
        )}
        {sortedMessages.map((msg, index) => {
          const messageDate = new Date(msg.created_at);
          const isSentMessage = msg.sender?.id === ADMIN_ID;

          let timestamp = messageDate.toLocaleString(undefined, {
            weekday: "long",
            day: "numeric",
            year: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={index}
              className={`flex ${isSentMessage ? "flex-row-reverse" : "flex-row"
                }`}
            >
              <div
                className={`mb-2 p-2 rounded ${isSentMessage
                    ? "bg-orange-100 w-fit text-blue-900"
                    : "bg-gray-100 text-gray-900"
                  }`}
              >
                <p>{msg.message}</p>
                {messageDate instanceof Date &&
                  !isNaN(messageDate.getTime()) && (
                    <p className="text-xs text-gray-500">{timestamp}</p>
                  )}
                <p>{msg.text}</p>
                <p className="text-xs text-gray-500">
                  {msg.time instanceof Date
                    ? msg.time.toLocaleString(undefined, {
                      weekday: "long",
                      day: "numeric",
                      year: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : ""}
                </p>
              </div>
            </div>
          );
        })}

        {userChat.some(
          (msg) =>
            msg.message &&
            msg.message.includes(
              "has requested to book your apartment please approve or decline"
            ) &&
            msg.sender.id !== ADMIN_ID // Check if the sender is not the admin
        ) && (
            <div className="flex justify-center mt-4">
              {approved === null &&
                loggedinuserid === receiverIds &&
                showApprovalSection && (
                  <div className="bg-gray-200 p-4 rounded-lg shadow-lg">
                    {selectedUserObj && (
                      <div className="flex items-center justify-center mb-4">
                        <img
                          src={selectedUserObj.profilePic || shbrologo}
                          alt={selectedUserObj.name}
                          className="w-10 h-10 rounded-full mr-2"
                        />
                        <p className="text-lg">
                          {selectedUserObj.name} has requested to book your
                          apartment. Approve or decline?
                        </p>
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                        onClick={handleApprove}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                        onClick={handleDecline}
                      >
                        Decline
                      </button>
                      <Link to={`/userdetails/${selectedUser}`}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600">
                          View Guest Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
            </div>
          )}
      </>
    );
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse flex items-center">
      <div className="w-32 h-5 bg-gray-200  mr-4"></div>
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const RecentMessages = ({ recentMessages, selectedUser, fetchUserChats }) => {
    return (
      <ul className="overflow-auto example">
        {recentMessages.map((message, index) => (
          <li
            key={index}
            className={`cursor-pointer flex justify-between hover:bg-gray-200 my-2 py-4 items-center p-2 px-4 ${selectedUser === message.user_id ? "bg-gray-200" : ""
              }`}
            onClick={() => fetchUserChats(message.user_id)}
          >
            <div className="flex items-center">
              <img
                src={message.profilePic || shbrologo}
                alt={message.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">{message.name}</p>
                <p
                  className={`text-sm text-gray-500 overflow-hidden overflow-ellipsis h-10`}
                >
                  {message.message.message}{" "}
                  {/* Assuming this is the message text */}
                </p>
              </div>
            </div>
            {/* <button
              className="bg-orange-300 text-white h-fit  text-sm px-2 py-1 ml-2 rounded"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the li click event from firing
                // Assuming this is the correct property for the user profile link
                window.location.href = message.userProfile;
              }}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
            </button> */}
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    console.log(
      "Recent Messages Updated:",
      recentMessages.map((message) => message.user_id)
    );
  }, [recentMessages]);
  return (
    <div>
      <div className="bg-gray-100 ">
        {/* <AdminHeader /> */}
        <div className="flex w-full">
          <div className="w-full  p-4 h-[85vh] overflow-auto example">
            <h1 className="text-xl font-semibold mb-4">Message</h1>
            <div className="flex ">
              <div className="hidden md:block  w-full md:w-1/3 border-r pr-4">
                <h2 className="text-lg font-semibold mb-2">Users</h2>
                <input
                  type="text"
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {loadingUsersCard ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading users...</p>
                  </div>
                ) : (
                  <RecentMessages
                    recentMessages={recentMessages}
                    selectedUser={selectedUser}
                    fetchUserChats={fetchUserChats}
                  />
                )}
              </div>

              {!selectedUser && (
                <div className="block md:hidden  w-full md:w-1/4 border-r pr-4">
                  <h2 className="text-lg font-semibold mb-2">Users</h2>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {loadingUsersCard ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Loading users...</p>
                    </div>
                  ) : (
                    <RecentMessages
                      recentMessages={recentMessages}
                      selectedUser={selectedUser}
                      fetchUserChats={fetchUserChats}
                    />
                  )}
                </div>
              )}
              {selectedUser &&
                (console.log(selectedUser),
                  (
                    <div className="w-full">
                      <div className="bg-white p-4 rounded shadow">
                        {selectedUser ? (
                          <>
                            <div className="flex items-center pb-4 gap-3">
                              <div className="cursor-pointer">
                                <FaArrowLeft
                                  onClick={() => setSelectedUser(null)}
                                />
                              </div>
                              {loadingMessages ? (
                                <SkeletonLoader />
                              ) : (
                                <Link to={`/userdetails/${selectedUser}`}>
                                  <p className="font-semibold">
                                    {selectedUserName}
                                  </p>
                                </Link>
                              )}
                            </div>
                            <div
                              ref={chatContainerRef}
                              className="h-[60vh] overflow-y-auto example"
                            >
                              {loadingMessages ? (
                                <div className="flex justify-center h-full items-center">
                                  <p>Loading messages...</p>
                                </div>
                              ) : (
                                <>
                                  {renderMessages(
                                    userChats,
                                    newMessages,
                                    selectedUser,
                                    users
                                  )}
                                 <div className="py-5">
                                 {isTyping && <TypingIndicator />}
                                 </div>
                                </>
                              )}

                            </div>

                            <div className="mt-4 flex gap-2">
                              <textarea
                                className="w-full p-2 border rounded"
                                placeholder="Type your message here..."
                                value={message}
                                onChange={handleTyping}
                                onKeyUp={handleKeyUp}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault(); // Prevent the default behavior of adding a new line
                                    sendMessage("text");
                                  }
                                }}
                              ></textarea>

                              <button
                                className="bg-orange-400 text-white px-4 py-2 rounded float-right"
                                onClick={() => sendMessage("text")}
                                disabled={sending}
                              >
                                <FontAwesomeIcon
                                  icon={faPaperPlane}
                                  className="mr-2"
                                />
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-500 flex items-center h-[80vh] justify-center">
                            Select a user to start chatting.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
