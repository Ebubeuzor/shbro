import React, { useState, useEffect } from "react";
import { styles } from '../Style';
import EmailForm from "./EmailForm";
import ChatEngine from "./ChatEngine";
import SupportHeader from "./SupportHeader";
import OptionWindow from "./OptionWindow";
import WelcomeForm from "./WelcomeForm";
import { useStateContext } from "../../../ContextProvider/ContextProvider";
import axios from "../../../Axios";
import { Button, Modal, Space } from 'antd';





//  // Position
//  position: 'fixed',
//  bottom: '11px',
//  right: '24px',
//  // Size
//  width: '370px',
//  height: '570px',
//  maxWidth: 'calc(100% - 48px)',
//  maxHeight: 'calc(100% - 48px)',
//  backgroundColor: 'white',
//  // Border
//  borderRadius: '12px',
//  // border: `2px solid #7a39e0`,
//  overflow: 'hidden',
//  zIndex:'1000',



const SupportWindow = (props) => {
    const storedUserData = localStorage.getItem("gnU");
    const initialUser = storedUserData ? JSON.parse(storedUserData) : null;
    const [_user, _setUser] = useState(initialUser);
    const [chat, setChat] = useState(null);
    const { user, token } = useStateContext();
    const [generatedToken, setGeneratedToken] = useState(localStorage.getItem("gnT"));
    const [generatedUserId, setGeneratedUserId] = useState(localStorage.getItem("gnUID"));
    const { confirm } = Modal;
    const [showLeaveChatConfirm, setLeaveChatConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingWelcomeForm, setLoadingWelcomeForm] = useState(false);



    const handleSubmitWelcomeForm = async (data) => {
        setLoadingWelcomeForm(true);
        await axios.post("/admin-guest-chat/startConversationOrReplyText", {
            message: "Live chat",
            status: "guest",
            recipient_id: "",
            chat_session_id: "",
            image: "",
            email: data.email,
            name: data.name,
        }).then((response) => {
            console.log(response.data.token)
            console.log(response.data.user_id)

            _setGeneratedUserId(response.data.user_id);
            _setGeneratedToken(response.data.token);
            _setGeneratedUser({ name: data.name, email: data.email });

        }).catch((error) => {


        }).finally(() => {
            setLoadingWelcomeForm(false)
        });



        console.log('Submitted:', data.name, data.email);


        //   console.log('Submitted:',response.data)

    }


    const _setGeneratedToken = (status) => {
        setGeneratedToken(status)
        if (status) {
            localStorage.setItem("gnT", status);
        } else {
            localStorage.removeItem("gnT");
        }
    }

    const _setGeneratedUserId = (status) => {
        setGeneratedUserId(status)
        if (status) {
            localStorage.setItem("gnUID", status);
        } else {
            localStorage.removeItem("gnUID");
        }
    }

    const _setGeneratedUser = (status) => {
        _setUser(status);
        if (status) {
            const data = {
                name: status.name,
                email: status.email
            };
            localStorage.setItem("gnU", JSON.stringify(data));
        } else {
            localStorage.removeItem("gnU");
        }
    }



    // starts the chat when the user clicks on live chat for Authenticated users
    useEffect(() => {

        const storedAgent = props.agentName


        // console.log(_user)


        if (props.selectedOption == "Live chat" && !storedAgent && token) {
            try {
                const response = axios.post("/admin-guest-chat/startConversationOrReplyText", {
                    message: "Live chat",
                    status: "guest",
                    recipient_id: "",
                    chat_session_id: "",
                    image: "",
                });

                if (response.data) {

                    console.log("Live chat", response.data)
                }
            } catch (error) {

            }

        }

    }, [props.selectedOption]);


    const handleLeaveChat = async () => {


        try {
            const adminId = props.agentName?.id
            const guestId = user?.id || generatedUserId;

            if (adminId) {
                setLoading(true);

                await axios.get(`/admin-guest-chat/leaveChat/${adminId}/${guestId}/guest`)

                console.log("left chat 👍")
                setLoading(false);

            }


            sessionStorage.removeItem('supportAgent');
            localStorage.removeItem("gnT");
            localStorage.removeItem("gnU");
            localStorage.removeItem("gnUID");
            setLeaveChatConfirm(false)
            _setUser(null);
            props.goToOptions();
           

        } catch (error) {
            console.error(error);

        }




    }


    const showPromiseConfirm = () => {
        confirm({
            title: 'Do you want to delete these items?',
            //   icon: <ExclamationCircleFilled />,
            okText: 'Leave Chat',
            cancelText: 'Return to Chat',
            centered: true,
            content: 'When clicked the OK button, this dialog will be closed after 1 second',
            async onOk() {
                try {
                    return await new Promise((resolve, reject) => {
                        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    });
                } catch {
                    return console.log('Oops errors!');
                }
            },
            onCancel() { },
        });
    };


    const handleShowLeaveChatConfirm = () => {
        setLeaveChatConfirm(!showLeaveChatConfirm);

    }

    useEffect(() => {

        if (props.visible == true) {
            props.clearUnreadCount(0);
        }



    }, [props.visible]);







    return (
        <div className={`transition-5 cursor-default bg-slate-800 z-[1000] bottom-0  overflow-hidden md:rounded-xl 
        fixed h-full w-full md:w-[400px] md:h-[550px] lg:h-[560px] md:bottom-3 md:right-6 md:max-h-[calc(100% - 48px)] md:max-w-[calc(100% - 48px)] ${props.visible===true}`}
         style={{
                ...styles.supportWindow,
                ...{
                    display: props.visible ? 'block' : 'none',
                    // opacity:props.visible ? '1':'0'

                }
            }}>

            <SupportHeader close={props.close} agentName={props.agentName}  leaveChat={(props.selectedOption === "Live chat"&& (token != null || _user != null)) ? handleShowLeaveChatConfirm : handleLeaveChat} showLeaveChatConfirm={showLeaveChatConfirm} />


            {/* <OptionWindow/> */}


            {(props.selectedOption === "Live chat" && token === null && _user === null) && <WelcomeForm visible={_user === null || chat === null} setUser={(user) => _setUser(user)}
                setChat={(chat) => setChat(chat)} onSubmit={handleSubmitWelcomeForm} loading={loadingWelcomeForm} />}


            {/* 
      {user===null || chat===null?
           <EmailForm
                setUser={(user)=>setUser(user)}
                setChat={(chat)=>setChat(chat)}
                visible={user===null || chat===null}
           />
              : */}

            {(props.botMessage || props.agentName) 
            && (props.selectedOption === "Live chat" ?(token || _user) : true)
             &&
                <ChatEngine
                    visible={props.selectedOption === "Live chat" ? !token != null : true}
                    chat={chat}
                    guestUser={_user}
                    userId={user?.id ?? generatedUserId}
                    token={token ?? generatedToken}
                    botMessage={props.botMessage}
                    selectedOption={props.selectedOption}
                    updateHeader={props.updateHeader}
                    showLeaveChatConfirm={showLeaveChatConfirm}
                    handleShowLeaveChatConfirm={handleShowLeaveChatConfirm}
                    handleLeaveChat={handleLeaveChat}
                    leaveChatLoading={loading}
                    UpdateUnreadCount={props.UpdateUnreadCount}
                    clearUnreadCount={()=>{props.clearUnreadCount(0)}}
                />
            }
            {/* } */}
        </div>
    )
}

export default SupportWindow;