import React, { useState, useEffect, useRef } from "react";
import { styles } from '../Style';
import messagesent from '../../../assets/message-sent.mp3'
import { SendOutlined } from '@ant-design/icons'
import { Avatar } from 'antd';
import ChatOptions from "./ChatOptions";
import axios from "../../../Axios";
import Logo from "../../../assets/logo.png";
import { BsRobot } from "react-icons/bs";
import SessionTimer from "../SessionTimer";
import { RiArrowDropLeftLine } from "react-icons/ri";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';








const ChatEngine = (props) => {

  const [startTime, setStartTime] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [email, setEmail] = useState('');
  const [supportAgent, setSupportAgent] = useState();
  const [emailProvided, setEmailProvided] = useState(false);
  const [isSessionEnded, setisSessionEnded] = useState(false);
  const [supportAgentConnected, isSupportAgentConnected] = useState(false);
  const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#4CAF50', '#E91E63', '#2196F3', '#FFC107', '#607D8B'];
  const [expiry, setExpiry] = useState("");


  const messageSentSound = new Audio(messagesent);

  const automateSlide = useRef();


  const imageRef = useRef();

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);  // Adjust delay as necessary, 1000 ms = 1 second

      // Cleanup function to clear the timer when the component unmounts or updates
      return () => clearTimeout(timer);
    }
  }, [isTyping]);


  const handleKeyUp = async (event) => {
    // setInputValue(event.target.value);



    const storedAgent = loadAgentFromSession();
    if (storedAgent) {
      setSupportAgent(storedAgent);
    }


    // Only send typing notification if the user was not already marked as typing
    if (!isTyping) {
      if (storedAgent?.id) {
        try {
          await axios.get(`/typing/${storedAgent.id}/${props.userId}`);
          console.log("typing....")
        } catch (error) {


        }
      }
      // setIsTyping(true);
      // sendTypingNotification(true);  // Notify that the user is typing
    }
  };




  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * ColorList.length);
    return ColorList[randomIndex];
  }



  const initializeEcho = (token, guestId) => {
    if (typeof window.Echo !== "undefined") {
      const channelName = `join.chat.${guestId}`;
      const channel = `left.chat.${guestId}`;
      window.Echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Authentication token is set:",
        window.Echo.connector.options.auth.headers.Authorization
      );

      const privateChannel = window.Echo.private(channelName);
      const privateChannelLeftChat = window.Echo.private(channel);
      const messageHandler = (data) => {
        messageSentSound.play();
        const agentAvatarColor = getRandomColor();// gets a random color from the list of colors

        const newMessage = {
          content: data.message,
          timestamp: formatDate(data.timejoined),
          isSentByUser: true,
          adminJoined: true,
          color: agentAvatarColor,
        };

        const agent = {
          id: data.adminid,
          name: data.message,
          session: data.sessionId,
          color: agentAvatarColor
        }


        props.updateHeader(agent);


        console.table(data);


        console.log("Admin joined ", data)
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setSupportAgent(agent);
        saveAgentToSession(agent);
        isSupportAgentConnected(true);

      };

      const leftChatHandler = (data) => {

        const color = sessionStorage.getItem('supportAgent');
        const parsedData = JSON.parse(color);
        const newMessage = {
          content: data.message,
          timestamp: formatDate(new Date()),
          isSentByUser: true,
          adminJoined: true, // adding this because of the styling adminJoined
          adminLeftChat: true,
          color: parsedData?.color
        };




        console.table(data);


        console.log("Admin left ", data)
        setExpiry("")
        messageSentSound.play();
        setMessages(prevMessages => [...prevMessages, newMessage]);
        sessionStorage.removeItem('supportAgent');
        localStorage.removeItem("gnT");
        localStorage.removeItem("gnU");
        localStorage.removeItem("gnUID");
        setisSessionEnded(true);
        props.updateHeader(null);


      }

      privateChannel.listen("JoinChatEvent", messageHandler);
      privateChannelLeftChat.listen("LeaveChatEvent", leftChatHandler);
      console.log("Listening for messages on channel:", channelName);
      console.log("Listening for messages on channel:", channel);

      return () => {
        privateChannel.stopListening("JoinChatEvent", messageHandler);
        privateChannelLeftChat.stopListening("LeaveChatEvent", leftChatHandler);
      };
    } else {
      console.error(
        "Echo is not defined. Make sure Laravel Echo is properly configured."
      );
    }
  };


  const initializeBroadcastReceiverEcho = (userId) => {
    const channelName = `chat.user.${userId}`;

    const privateChannel = window.Echo.private(channelName);

    const messageHandler = (data) => {
      messageSentSound.play(); // Ensure messageSentSound is defined and loaded
      props.UpdateUnreadCount()
      const newMessage = {
        id: data.id,
        content: data.message,
        image: data.image,
        timestamp: data.created_at,
        isSentByUser: false,
        session: data.sessionId
      };

      console.log("Admin sent a message", data);

      setMessages(prevMessages => [...prevMessages, newMessage]);
      automateSlide.current.scrollIntoView({ behavior: 'smooth' });
      updateSessionTime(); // update the session time back to 7 mins
    };

    privateChannel.listen("MessageBroadcasted", messageHandler);

    console.log("Listening for messages on channel:", channelName);

    // Return a function to unsubscribe from the channel
    return () => {
      privateChannel.stopListening("MessageBroadcasted", messageHandler);
    };
  };

  const initializeTypingEcho = (userId) => {
    const channelName = `typing.${userId}`;

    const privateChannel = window.Echo.private(channelName);
    let typingTimeout;
    const messageHandler = (data) => {
      if (!isTyping) {
        setIsTyping(true);
      }// Adjust the timeout duration as needed

      console.log("typing", data)
    };

    privateChannel.listen("Typing", messageHandler);

    console.log("Listening for messages on channel:", channelName);

    // Return a function to unsubscribe from the channel
    return () => {
      privateChannel.stopListening("Typing", messageHandler);
    };
  };

  const initializeSessionEndEcho = (userId) => {
    const channelName = `chat.endsession.${userId}`;

    const privateChannel = window.Echo.private(channelName);

    const messageHandler = (data) => {
      const newMessage = {
        id: "notification",
        content: data.notification,
        isSentByUser: true,
        sessionEnded: true,
        adminJoined: true, /// i put this here to make use of te style i used in Displaying Admin joined message
      };


      messageSentSound.play(); // Ensure messageSentSound is defined and loaded
      setMessages(prevMessages => [...prevMessages, newMessage]);
      automateSlide.current.scrollIntoView({ behavior: 'smooth' });
      sessionStorage.removeItem('supportAgent');
      props.updateHeader(null);
      setisSessionEnded(true);
      localStorage.removeItem("gnT");
      localStorage.removeItem("gnU");
      localStorage.removeItem("gnUID");



      console.log("SessionEnded", data)
    };

    privateChannel.listen("SessionEnded", messageHandler);

    console.log("Listening for messages on channel:", channelName);

    // Return a function to unsubscribe from the channel
    return () => {
      privateChannel.stopListening("SessionEnded", messageHandler);
    };

  };



  const saveAgentToSession = (agent) => {
    const data = {
      expiry: Date.now() + 420000, // 420000 milliseconds = 7 minutes
      id: agent.id,
      name: agent.name,
      session: agent.session,
      color: agent.color

    };
    setExpiry(data.expiry);
    sessionStorage.setItem('supportAgent', JSON.stringify(data));
  };

  const updateSessionTime = () => {
    // Retrieve existing data from session storage
    const existingDataString = sessionStorage.getItem('supportAgent');
    const existingData = JSON.parse(existingDataString);

    // Update expiry value
    if (existingData) {

      existingData.expiry = Date.now() + 420000;
      setExpiry(Date.now() + 420000);
    }

    // Store updated data back into session storage
    sessionStorage.setItem('supportAgent', JSON.stringify(existingData));

  }


  const loadAgentFromSession = () => {
    const storedData = sessionStorage.getItem('supportAgent');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.expiry > Date.now()) {
        setExpiry(parsedData.expiry)
        return parsedData;
      } else {
        // Clear expired data
        sessionStorage.removeItem('supportAgent');
        localStorage.removeItem("gnT");
        localStorage.removeItem("gnU");
        localStorage.removeItem("gnUID");
        setisSessionEnded(true);
      }
    }
    return null;
  };




  useEffect(() => {




    if (props.selectedOption == "Live chat") {

      const storedAgent = loadAgentFromSession();
      if (storedAgent) {
        setSupportAgent(storedAgent);
      }






      const cleanupInitial = initializeEcho(props.token, props.userId);
      const cleanupBroadcastReceiver = initializeBroadcastReceiverEcho(props.userId);
      const cleanupTyping = initializeTypingEcho(props.userId);
      const cleanupSessionEnd = initializeSessionEndEcho(props.userId);

      return () => {
        cleanupInitial();
        cleanupBroadcastReceiver(); // Cleanup function to unsubscribe
        cleanupTyping();
        cleanupSessionEnd();

      };
    }
  }, [props.token, props.userId]);


  const formatDate = (inputDate) => {
    const now = new Date();
    const date = new Date(inputDate);

    const isToday = now.toDateString() === date.toDateString();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (isToday) {
      return `today, ${hours}:${minutes}`;
    } else {
      // Further handling can be added here
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}, ${hours}:${minutes}`;
    }
  };



  // starts the chat when the user clicks on live chat
  // useEffect(() => {

  //   const storedAgent = loadAgentFromSession();
  //   if (props.selectedOption == "Live chat" && !storedAgent) {
  //     try {
  //       const response = axios.post("/admin-guest-chat/startConversationOrReplyText", {
  //         message: "Live chat",
  //         status: "guest",
  //         recipient_id: "",
  //         chat_session_id: "",
  //         image: "",
  //         email:"",
  //         name:"",
  //       });

  //       if (response.data) {

  //         console.log("Live chat", response.data)
  //       }
  //     } catch (error) {

  //     }

  //   }

  // }, [props.selectedOption]);


  // loads the chat in a current session


  useEffect(() => {

    const storedAgent = loadAgentFromSession();
    if (storedAgent) {
      // setSupportAgent(storedAgent);



      const userId = props.userId;
      const adminId = storedAgent.id;
      const sessionId = storedAgent.session;

      console.table({ userId, sessionId, adminId })

      axios.get(`/admin-guest-chat/getChatMessages/${adminId}/${userId}/${sessionId}`).then((response) => {

        console.log("history", response.data)

        const formattedChats = response.data.chat_messages.map((element) => {
          return {
            id: element.id,
            content: element.message,
            image: element.image,
            timestamp: element.created_at,
            isSentByUser: element.status == "guest" ? true : false,


          }
        });

        console.log("historyformatted", formattedChats)

        setMessages([...formattedChats]);









      }).catch(() => { })











    }






  }, [props.userId]);






  useEffect(() => {
    let delayBot;

    setStartTime(new Date());
    const storedAgent = loadAgentFromSession();



    if (props.botMessage && props.visible && (!storedAgent)) {
      const newMessages = props.botMessage.map((element, index) => {
        return {
          content: element,
          timestamp: new Date(),
          isSentByUser: false,


        };
      });

      if (props.selectedOption == "Live chat") {

        const userInitialMessage = {

          content: "Live chat",
          timestamp: new Date(),
          isSentByUser: true,


        }

        setMessages([userInitialMessage]);


      }


      setIsTyping(true);
      clearTimeout(delayBot);

      delayBot = setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, ...newMessages]);

        setIsTyping(false);
        messageSentSound.play();
      }, 900)



    }

    return () => {
      clearTimeout(delayBot);
    };



  }, []);








  const handleSendMessage = async (e) => {
    e.preventDefault();
    // if (!emailProvided) {
    //   // Handle email submission (if needed)
    //   // You can add additional logic or API calls related to email submission here
    // } else 


    const storedAgent = loadAgentFromSession();







    if (inputMessage.trim() === '' && imageInput.trim() === '') {
      return; // Don't send empty messages
    } else {


      try {
        // Regular message sending logic
        messageSentSound.play();
        const newMessage = {
          content: inputMessage,
          image: imageInput,
          timestamp: new Date(),
          isSentByUser: true,
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);



        console.log("base64", imageInput);

        setInputMessage('');
        setImageInput('');
        setImagePreview('');
        automateSlide.current.scrollIntoView({ behavior: 'smooth' });


        console.log("sent?", {
          message: inputMessage,
          image: imageInput,
          status: "guest",
          recipient_id: storedAgent ? `${storedAgent.id}` : "",
          chat_session_id: storedAgent ? `${storedAgent.session}` : "",
          sent: true
        });

        if (storedAgent) {
          setSupportAgent(storedAgent);

          console.log("sent1?", {
            mmessage: inputMessage,
            image: imageInput,
            status: "guest",
            recipient_id: `${storedAgent.id}`,
            chat_session_id: `${storedAgent.session}`,
            name: props.guestUser?.name || "",
            email: props.guestUser?.email || ""
          });


          const response = await axios.post("/admin-guest-chat/startConversationOrReplyText", {
            message: inputMessage,
            image: imageInput,
            status: "guest",
            recipient_id: `${storedAgent.id}`,
            chat_session_id: `${storedAgent.session}`,
            name: props.guestUser?.name || "",
            email: props.guestUser?.email || ""
          });



          updateSessionTime(); // update the session time back to 7 mins

        } else {
          console.log("sent2?", {
            mmessage: inputMessage,
            image: imageInput,
            status: "guest",
            recipient_id: `${storedAgent.id}`,
            chat_session_id: `${storedAgent.session}`,
            name: props.guestUser?.name || "",
            email: props.guestUser?.email || ""
          });
          const response = await axios.post("/admin-guest-chat/startConversationOrReplyText", {
            message: inputMessage,
            image: imageInput,
            status: "guest",
            recipient_id: "",
            chat_session_id: "",
            name: props.guestUser?.name || "",
            email: props.guestUser?.email || ""
          });

        }


      } catch (error) {

        console.error(error);

      }

    }
  };

  const handleImageInputChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      // Set the image preview using a blob URL
      setImagePreview(URL.createObjectURL(file));

      const reader = new FileReader();

      // When the file is read as a Data URL, handle the Base64 string
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImageInput(base64String); // Use the Base64 string for other purposes
      };

      // In case of errors during the file reading
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      // Read the file as a Data URL (base64)
      reader.readAsDataURL(file);
    } else {
      // Handle cases where no file was selected
      console.error('No file selected');
    }
  };


  const clickImage = (e) => {
    e.preventDefault();
    imageRef.current.click();

  }


  //   let typingTimeout = null;

  // const handleTypingStart = () => {
  //   if (typingTimeout) {
  //     clearTimeout(typingTimeout);
  //   }

  //   setIsTyping(true);
  //   typingTimeout = setTimeout(() => {
  //     setIsTyping(false);
  //   }, 4000); // Adjust the delay as needed
  // };


  const checkEmailValid = () => {
    // Check if a valid email is provided before moving to regular input
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailProvided(true);
    } else {
      // Handle invalid email case
      alert('Please provide a valid email address.');
    }
  }


  const extractName = (content) => {
    // Use a regular expression to match either "has joined the chat" or "has left the chat"
    const match = content.match(/^(.*?)\s*has (joined|left) the chat/);
    // If a match is found, return the name part, otherwise return the full content
    return match ? match[1] : content;
  };

  useEffect(() => {
    if (props.visible == true) {

      props.clearUnreadCount();
    }
  }, [props.visible])



  /// Logic for if no one joins after 5 mins
  useEffect(() => {
    if (props.selectedOption === "Live chat") {
      let timeoutTriggered = false;
      let agentAvailable = false;
  
      // Function to set initial message if agent is not available after 5 minutes
      const setInitialMessage = () => {
        if (!timeoutTriggered && !agentAvailable) {
          setIsTyping(true);
          const userInitialMessage = {
            content: "No agent available. Please contact our support desk at info@shortletbooking.com",
            timestamp: new Date(),
            isSentByUser: false,
          };
          setMessages(prevMessages => [...prevMessages, userInitialMessage]);
          setIsTyping(false);
          setisSessionEnded(true);
        }
      };
  
      // Load agent from session
      const storedAgent = loadAgentFromSession();
  
      // If agent is not available, set initial message after 5 minutes
      if (!storedAgent) {
        const timeout = setTimeout(setInitialMessage, 5 * 60 * 1000); // 5 minutes in milliseconds
  
        // Cleanup function to prevent setting the initial message if agent becomes available
        return () => {
          clearTimeout(timeout);
          timeoutTriggered = true; // Flag indicating the timeout has been triggered
        };
      } else {
        agentAvailable = true; // Marking agent as available
      }
    }
  }, [supportAgent]);
  







  return (
    <div className={`transition-3 overflow-hidden ${props.visible ? `${props.showLeaveChatConfirm ? "md:h-[100%] h-[100%]" : "md:h-[90%] h-[92%]"} ` : "md:h-[0%] h-[0%]"}  `} style={{
      ...styles.chatEngineWindow,
      ...{
        // height:props.visible ? '90%':'0%',
        zIndex: props.visible ? '100' : ' 0',
        opacity: props.visible ? '1' : '0'

        ,
      }
    }}>

      {props.showLeaveChatConfirm ?
        //    levechat modal confirm
        <div className="h-full relative "  >
          <div className=" ml-1  mt-2  "> <button disabled={props.leaveChatLoading} onClick={() => { props.handleShowLeaveChatConfirm() }}  ><RiArrowDropLeftLine className=" h-8 hover:bg-slate-50/70 rounded-lg  w-8" /></button></div>

          <div className=" justify-center mx-2 md:mx-6 mt-[25%] md:mt-[5%] flex flex-col space-y-32" >

            <div className=" flex flex-col gap-6 items-center ">
              <img src={Logo} alt="Sent Image" className=" w-28 h-28 mb-2" />

              <p className=" text-center text-slate-700  " >Closing this chat will end our current session, but rest assured, we will have a record of your conversation for future reference.</p>

            </div>

            <div className=" flex gap-4 ">

              <button disabled={props.leaveChatLoading}
                className=" bg-slate-50 hover:bg-slate-100 text-orange-400 rounded-full p-3 w-full  text-lg "
                onClick={() => { props.handleShowLeaveChatConfirm() }}  >Return to Chat</button>
              <button disabled={props.leaveChatLoading}
                className=" bg-slate-100 hover:bg-slate-200 text-orange-400 rounded-full p-3 w-full  text-lg font-medium "
                onClick={() => { props.handleLeaveChat() }} >

                {props.leaveChatLoading ?
                  <>
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 28,
                            color: "orange"
                          }}
                          spin
                        />
                      }

                    />
                    Leaving Chat
                  </>
                  :
                  <>Leave Chat   </>}
              </button>

            </div>

          </div>

        </div>

        :


        <div className="h-full relative" >
          {/* Timestamp for when the chat started */}
          {/* Timestamp for when the chat started */}

          <div className="text-sm  self-center text-center left-[1%] p-1 w-fit shadow bg-white/70 text-gray-500 absolute top-0" >
            <SessionTimer expiry={expiry} />
          </div>


          {/* Chat messages display */}

          <form className="flex flex-col h-full w-full border p-4">
            <div className="flex example flex-col gap-4 flex-grow overflow-y-auto mb-4 ">
              <div className="mb-4 text-center ">
                Chat started: {startTime && formatDate(startTime)}
              </div>


              {/* <div
            
            className= ' self-start bg-gray-200 text-slate-800 p-3 rounded-lg max-w-3/4 '
          >

            <p className="text-sm">Welcome! Please select a support:</p>
            <span className="text-xs">{startTime && formatDate(startTime)}</span>
          </div> */}



              {props.selectedOption != "Live chat" && <div

                className=' self-end bg-blue-500/80 text-white rounded p-3  max-w-3/4 '
              >

                <p className="text-sm">{props.selectedOption}</p>
                <span className="text-xs text-right">{startTime && formatDate(startTime)}</span>
              </div>}






              {messages.map((message, index) => (

                <div className={`${message.adminJoined ? `flex flex-col my-4 gap-1 items-center justify-center text-center` :
                  `${message.isSentByUser ? 'self-end bg-blue-500/90 text-white' : 'self-start text-slate-800 bg-gray-200/40'
                  } p-3  max-w-[250px] rounded   `}`} key={index}
                  style={!(message.adminJoined) ? { wordBreak: 'break-word' } : {}}
                >



                  {message.adminJoined ? (
                    // <div className="flex flex-col my-4 gap-1 items-center justify-center text-center">

                    <>

                      {!(message.sessionEnded) && <>
                        <Avatar
                          // className={` relative   box-border block md:h-[60px] md:w-[60px] h-[45px] w-[45px] 
                          // bg-center rounded-[50%] bg-cover bg-no-repeat   `}
                          style={{
                            backgroundColor: message.color,
                            verticalAlign: 'middle',
                          }}
                          size="large"


                        >
                          {message.content.charAt(0)}
                        </Avatar>
                        <p className="max-w-[200px]  text-gray-800 font-medium text-xl whitespace-normal" style={{ wordBreak: 'break-word' }}>
                          {extractName(message.content)}
                        </p>
                        <p className="max-w-[200px] font-medium whitespace-normal">
                          {message.adminLeftChat ? " left the chat" : " joined the chat"}
                        </p>
                        <span className="text-xs">{message.timestamp}</span>

                      </>
                      }

                      {message.sessionEnded && <div className=" my-2 w-full font-medium text-slate-600 bg-slate-50 text-center " >{message.content}</div>}

                    </>

                    // </div>
                  )
                    :
                    // <div

                    //   className={`${message.isSentByUser ? 'self-end bg-blue-500/90 text-white' : 'self-start text-slate-800 bg-gray-200/40'
                    //     } p-3  max-w-[250px] rounded   `}
                    //   style={{ wordBreak: 'break-word' }}
                    // >

                    <>

                      {message.image ? (
                        <div className="relative">

                          <div className={`${message.isSentByUser ? "-right-3 hidden" : "-left-3 block"} absolute  -bottom-11  `}>
                            <Avatar
                              style={{
                                backgroundColor: supportAgent ? supportAgent.color : "transparent",
                                verticalAlign: 'middle',
                              }}
                              className={` relative   box-border block 
                            bg-center  bg-cover bg-no-repeat   `}
                              icon={!supportAgent && <BsRobot
                                className=" text-orange-500 w-5 h-5    " />}
                              size="small"

                            >
                              {supportAgent?.name.charAt(0)}
                            </Avatar>
                          </div>

                          <a href={message.image} download={`image_${index}.png`} className="text-blue-500 hover:underline block">
                            <img src={message.image} alt="Sent Image" className="max-w-full md:max-h-[150px] mb-2" />
                            Download Image
                          </a>
                        </div>
                      ) : (


                        <div className="relative" >
                          <div className={`${message.isSentByUser ? "-right-3 hidden" : "-left-3 block"} absolute  -bottom-11  `}>
                            {/* <img
                            src="https://tecdn.b-cdn.net/img/new/avatars/2.webp"
                            className="md:w-5 w-5 rounded-full"
                            alt="Avatar" /> */}


                            <Avatar
                              style={{
                                backgroundColor: supportAgent ? supportAgent.color : "transparent",
                                verticalAlign: 'middle',
                              }}
                              className={` relative   box-border block 
                            bg-center  bg-cover bg-no-repeat   `}
                              icon={!supportAgent && <BsRobot
                                className=" text-orange-500 w-5 h-5    " />}
                              size="small"

                            >
                              {supportAgent?.name.charAt(0)}
                            </Avatar>

                          </div>

                          <p className="text-sm relative">
                            {message.content}

                          </p>
                        </div>





                      )}

                      <span className="text-xs">{formatDate(message.timestamp)}</span>






                    </>



                    // </div>


                  }






                </div>




              ))}

              {!isTyping && (<ChatOptions selectedOption={props.selectedOption} automateSlide={automateSlide} />)}


              {/*typing indicator  */}
              {isTyping && (
                <div className="self-start  bg-gray-300 p-2 rounded-lg max-w-[200px]">
                  <div className="dot-pulse1">
                    <div className="dot-pulse1__dot"></div>
                  </div>
                </div>
              )}

              <span ref={automateSlide} className=" mt-1  "></span>
            </div>




            {/* Input area for typing messages */}

            <>

              <div className={` relative ${props.selectedOption === "Find hosting questions" || props.selectedOption === "Find booking questions" || props.selectedOption === "Shrbo Support"||isSessionEnded ? "hidden" : "flex"}`}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow rounded-l-lg p-2 border pr-7 focus:border-2 focus:border-r-0 focus:border-blue-500 "
                  value={inputMessage}
                  onKeyUp={handleKeyUp}
                  onChange={(e) => { setInputMessage(e.target.value); }}

                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={imageRef}
                  onChange={handleImageInputChange}
                />

                <button className="bg-blue-500 text-white  rounded-r-lg p-2" onClick={handleSendMessage}>
                  <span className={`${imageInput !== "" || inputMessage !== "" ? "hidden" : "block"}`}  >Send</span>
                  <SendOutlined className={`${imageInput !== "" || inputMessage !== "" ? "block" : "hidden"} w-8  `} />
                </button>
                <button
                  className=" text-white rounded-r-lg p-2 right-12 absolute  "
                  onClick={clickImage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={"24px"} height={"24px"} viewBox="0 0 24 24"><title>Upload Image</title><path d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,
            1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z" /></svg>
                </button>

              </div>
              {imagePreview && (
                <div className="max-w-[200px] max-h-[100px] mt-2">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="max-w-full max-h-full rounded-lg"
                  />
                </div>
              )}
            </>
            {/* )} */}

          </form>
        </div>



      }





    </div>
  )
}

export default ChatEngine;

















