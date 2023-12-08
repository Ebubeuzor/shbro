import React,{useState} from "react";
import {styles} from './Style'


const Avatar=(props)=>{
    const [hovered,setHovered]=useState(false);

    return(
            <div className={props.style}>
                <div
                className="transition-3"
                style={{
                    ...styles.avatarHello,
                    ...{display:hovered ? 'block' :'none'}
                }}>Customer Support</div>
                <div 
                className=" "
                onMouseEnter={()=>setHovered(true)}
                onMouseLeave={()=>setHovered(false)}
                onClick={()=>props.onClick&& props.onClick()}
                style={{
                    ...styles.chatWithMeButton,
                    ...{border:hovered ? '1px solid #f9f0ff':'4px solid rgb(251,146,60)'}
                    
                }} />
                
                

            </div>

    )


}

export default Avatar;