import React,{useState} from "react";
import {styles} from '../Style';
import {LoadingOutlined}  from '@ant-design/icons';
import Avatar from "../Avatar";
import { Link } from "react-router-dom";


const EmailForm = (props) => {
    const [email,setEmail]=useState('');
    const [loading,setLoading]=useState(false);
    const [isAnimation,setIsAnimation]=useState(true);

    function handleSubmit(event){
            event.preventDefault();
            setLoading(true)
            props.setUser(event.target.value);
            props.setChat("hello");
            console.log('Sending email')

            let animation;

            animation = setTimeout(() => {
                setIsAnimation(false);
              }, 3000);
        


    }

   


    return (
        <div className="transition-3 bg-white"  
            style={{
                ...styles.emailFormWindow,
                ...{
                    height:props.visible?"100%":"0%",
                    opacity:props.visible? '1':'0',
                    display:isAnimation? "block":"none",
                }
            }}
        >
            <div style={{ height:'0px'}}>
                <div style={styles.stripe2}           />

            </div>
            
            <div
                className="transition-3"
                style={{
                    ...styles.loadingDiv,
                    ...{
                        zIndex:loading? '10':'-1',
                        display:loading? "block" :"none",
                        opacity:loading? '0.33':'0',
                    }
                }}

            />
            <LoadingOutlined 
                className="transition-3"
                style={{
                    ...styles.loadingIcon,
                    ...{
                        zIndex:loading? '10':'-1',
                        display:loading? "block" :"none",
                        opacity:loading? '1':'0',
                        fontSize:'82px',
                        top:'calc(50% - 41px)',
                        left:'calc(50% - 41px)',


                    }
                
                
                }}
            />

            <div style={{position:"absolute",height:'100%',width:'100%',textAlign:'center'}} >
                <Avatar style={ " relative left-[50%] -ml-11  top-[10%] "}    />
                
                <div style={styles.topText}>
                    Welcome to our <br/> live chat!
                </div>

                <form
                    onSubmit={e=>handleSubmit(e)}
                    style={{position:'relative',width:'100%',top:'19.75%'}}
                  
                >
                    <input
                        type="email"
                        required
                        style={styles.emailInput}
                        onChange={e=>setEmail(e.target.value)}
                        placeholder="your email"

                    />

                </form>

                <div style={styles.bottomText} className="">
                    Enter your email <br/> to get started. 
                    or <Link className=" underline text-sm">log in</Link> 
                </div>
                

          

                





            </div>

           

        </div>
    )
}

export default EmailForm;