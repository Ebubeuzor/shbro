import React, { useState,useRef,useEffect } from "react";
import Avatar from "./Avatar"
import SupportWindow from "./SupportWindow/SupportWindow";
import { FloatButton } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import OptionWindow from "./SupportWindow/OptionWindow";

const ChatSupport = () => {
    const ref=useRef(null)
    const [visible,setVisible]=useState(false);
    const  [showOption,setShowOption]=useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [botMessage, setBotMessage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleOptionSelected = (option) => {


      senddbotMessage(option)  
        
      setSelectedIssue(option);
      setVisible(true);
      setShowOption(false);
      setSelectedCategory(option);
        console.log(option);
    };

    function handleClose(){
    
            setVisible(false);
            setShowOption(false);
  
    }

    const handleOpen=()=>{
      if(selectedIssue===null){
         setShowOption(true);
        }
        else{
            setVisible(true);
        }

    }

    const SupportCategories=[   
        {index:1,report:"Shrbo Support",message:["Select a Support Question from the list:",]},
        {index:2,report:"Find booking questions",message:["Select a Booking Question from the list: ",]},
        {index:3,type:"Find hosting questions",report:"Find hosting questions",message:["Select a Hosting Question from the list:"]},
        {index:4,report:"Live chat",message:["Hey,please wait a minute while I try to redirect you to one of our Support agents.."]}
    ] ; 



    const senddbotMessage = (option) => {
        const botm = SupportCategories.find((r) => r.report.trim() === option.trim());
      
        if (botm) {
          const messages = botm.message; // Access the 'message' property from the object
          const menu=botm.type==="menu";
          console.log(messages);
          setBotMessage(messages);
        } else {
          console.log("Category not found.");
        }
      };
      

    
    
   

       
        
    
    




    return (
        <div ref={ref} className=" w-full "  >
            <SupportWindow 
                visible={visible}
                close={handleClose}
                botMessage={botMessage}
                selectedOption={selectedIssue}


            />

            {showOption&&<OptionWindow close={handleClose} selectedOption={(option)=>{handleOptionSelected(option)}} />}



            {!visible&& <FloatButton type="default" icon={<CommentOutlined />} badge={{
          count: 1,
        }}
        
         tooltip={<div className="   ">Customer Support</div>}  onClick={ handleOpen}    />
            }

{/* {!visible&& <Avatar style={" bottom-2  right-6 fixed "} />
            }
         */}

        </div>
    )
}

export default ChatSupport;