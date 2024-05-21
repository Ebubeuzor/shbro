import React, { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar"
import SupportWindow from "./SupportWindow/SupportWindow";
import { FloatButton } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import OptionWindow from "./SupportWindow/OptionWindow";
import { useStateContext } from "../../ContextProvider/ContextProvider";

const ChatSupport = () => {

  const ref = useRef(null)
  const [visible, setVisible] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [botMessage, setBotMessage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [agent, setAgentName] = useState(null);
  const [unreadCount, setunreadCount] = useState(0)
  const { user, token } = useStateContext();

  const handleOptionSelected = (option) => {


    senddbotMessage(option)

    setSelectedIssue(option);
    setVisible(true);
    setShowOption(false);
    setSelectedCategory(option);
    console.log(option);
  };

  function handleClose() {

    setVisible(false);
    setShowOption(false);

  }

  const goToOptions = () => {

    setAgentName(null);
    setVisible(false);
    setShowOption(true);
    setSelectedCategory(null);
    setSelectedIssue(null)
    setBotMessage(null)

  }

  const handleOpen = () => {
    if (selectedIssue === null) {
      setShowOption(true);
    }
    else {
      setVisible(true);
    }

  }

  const SupportCategories = [
    { index: 1, report: "Shrbo Support", message: ["Select a Support Question from the list:",] },
    { index: 2, report: "Find booking questions", message: ["Select a Booking Question from the list: ",] },
    { index: 3, type: "Find hosting questions", report: "Find hosting questions", message: ["Select a Hosting Question from the list:"] },
    { index: 4, report: "Live chat", message: ["Hey,please wait a minute while I try to redirect you to one of our Support agents.."] }
  ];


  const loadAgentFromSession = () => {
    const storedData = sessionStorage.getItem('supportAgent');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.expiry > Date.now()) {
        return parsedData;
      } else {
        // Clear expired data
        sessionStorage.removeItem('supportAgent');
      }
    }
    return null;
  };

  

  // const initializeUnreadMessagesReceiverEcho = (token,userId) => {

  //   if (typeof window.Echo !== "undefined") {
  //     const channelName = `chat.user.${userId}`;

  //     window.Echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
  //     console.log(
  //       "Authentication token is set:",
  //       window.Echo.connector.options.auth.headers.Authorization
  //     );



  //     const privateChannel = window.Echo.private(channelName);

  //     const messageHandler = (data) => {
  //       // messageSentSound.play(); // Ensure messageSentSound is defined and loaded
  //       // const newMessage = {
  //       //   id: data.id,
  //       //   content: data.message,
  //       //   image: data.image,
  //       //   timestamp: data.created_at,
  //       //   isSentByUser: false,
  //       //   session: data.sessionId
  //       // };

  //       // const count=unreadCount++

  //       setunreadCount(prevCount => prevCount++);

  //       console.log("Admin sent a message Chat Support", data);

  //       // setMessages(prevMessages => [...prevMessages, newMessage]);
  //       // updateSessionTime(); // update the session time back to 7 mins
  //     };

  //     privateChannel.listen("MessageBroadcasted", messageHandler);

  //     console.log("Listening for messages on channel:", channelName);

  //     // Return a function to unsubscribe from the channel
  //     return () => {
  //       privateChannel.stopListening("MessageBroadcasted", messageHandler);
  //     };
  //   } else {
  //     console.error(
  //       "Echo is not defined. Make sure Laravel Echo is properly configured."
  //     );
  //   }
  // };



  useEffect(() => {
    const storedAgent = loadAgentFromSession();
    if (storedAgent) {
      setAgentName(storedAgent);
      // setVisible(true);
      setShowOption(false);
      setSelectedCategory("Live chat");
      setSelectedIssue("Live chat")
      setBotMessage("hhhhh")

      // const uToken=token||localStorage.getItem("gnT");
      // const userId=user?.id||localStorage.getItem("gnUID");

      // const cleanupBroadcastReceiver= initializeUnreadMessagesReceiverEcho(uToken,userId) ;

      // console.log("In Here")

      // return () => {
      //   cleanupBroadcastReceiver(); // Cleanup function to unsubscribe
      
  
      // };



    }





  }, []);


  const updateHeader = (agentDetails) => {

    setAgentName(agentDetails)


  }




  const senddbotMessage = (option) => {
    const botm = SupportCategories.find((r) => r.report.trim() === option.trim());

    if (botm) {
      const messages = botm.message; // Access the 'message' property from the object
      // const menu=botm.type==="menu";
      console.log(messages);
      setBotMessage(messages);
    } else {
      console.log("Category not found.");
    }
  };


  const handleUpdateUnreadCount = () => {
    setunreadCount(prevCount => prevCount + 1);
};



 


















  return (
    <div ref={ref} className=" w-full "  >
      <SupportWindow
        visible={visible}
        close={handleClose}
        botMessage={botMessage}
        selectedOption={selectedIssue}
        agentName={agent}
        updateHeader={(data) => { updateHeader(data) }}
        goToOptions={goToOptions}
        clearUnreadCount={(count)=>{setunreadCount(count)}}
        UpdateUnreadCount={handleUpdateUnreadCount}



      />

      {showOption && <OptionWindow close={handleClose} selectedOption={(option) => { handleOptionSelected(option) }} />}



      {!visible && <FloatButton type="default" icon={<CommentOutlined />} badge={{
        count: unreadCount,
      }}

        // tooltip={<div className="   ">Customer Support</div>}
        onClick={handleOpen} />
      }

      {/* {!visible&& <Avatar style={" bottom-2  right-6 fixed "} />
            }
         */}

    </div>
  )
}

export default ChatSupport;