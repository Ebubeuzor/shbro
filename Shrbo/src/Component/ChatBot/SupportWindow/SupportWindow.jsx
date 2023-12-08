import React,{useState} from "react";
import {styles} from '../Style';
import EmailForm from "./EmailForm";
import ChatEngine from "./ChatEngine";
import SupportHeader from "./SupportHeader";
import OptionWindow from "./OptionWindow";
import WelcomeForm from "./WelcomeForm";




  
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
    const [user,setUser]=useState(null);
    const [chat,setChat]=useState(null);
   
    return (
        <div className="transition-5 cursor-default bg-slate-800 z-[1000] bottom-0  overflow-hidden md:rounded-xl fixed h-full w-full md:w-[400px] md:h-[550px] lg:h-[560px] md:bottom-3 md:right-6 md:max-h-[calc(100% - 48px)] md:max-w-[calc(100% - 48px)] " style={{
                        ...styles.supportWindow,
                        ...{display:props.visible ? 'block':'none',
                            // opacity:props.visible ? '1':'0'
                        
                      }
        }}>

         <SupportHeader close={props.close} />


         {/* <OptionWindow/> */}


         {props.selectedOption==="Live chat"&&<WelcomeForm visible={user===null || chat===null} setUser={(user)=>setUser(user)}
                setChat={(chat)=>setChat(chat)}/>}


{/* 
      {user===null || chat===null?
           <EmailForm
                setUser={(user)=>setUser(user)}
                setChat={(chat)=>setChat(chat)}
                visible={user===null || chat===null}
           />
              : */}

        {props.botMessage&&
           <ChatEngine
           visible={props.selectedOption==="Live chat"?!(user===null || chat===null):true}
           chat={chat}
           user={user}
           botMessage={props.botMessage}
           selectedOption={props.selectedOption}
           />
        } 
{/* } */}
        </div>
    )
}

export default SupportWindow;