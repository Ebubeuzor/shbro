import React, { useState } from 'react';
import { styles } from '../Style';
import Avatar from "../Avatar";
import { Link } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import logo from '../../../assets/logo.png'




const WelcomeForm = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAnimation, setIsAnimation] = useState(true);


  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here

    props.setChat("hello");
    console.log('Sending email')


    let animation;

    animation = setTimeout(() => {
      setIsAnimation(false);
    }, 3000);




    props.onSubmit({ name, email })


  };




  return (
    <div className=" mx-auto   bg-white rounded shadow-md" style={{
      ...styles.emailFormWindow,
      ...{
        height: props.visible ? "100%" : "0%",
        opacity: props.visible ? '1' : '0',
        display: props.visible ? "block" : "none",
      }
    }}>

      <div style={{ height: '0px' }}>
        <div style={styles.stripe} />

      </div>

      <div className=" px-6 w-full text-2xl font-medium pt-3 support/bot gap-2 relative   text-white flex justify-start items-center ">

        <img
          src={logo}
          className="w-20 rounded-full bg-slate-100"
          alt="Avatar" />
        Hello,
      </div>

      <h2 className="text-2xl pt-6 px-6 font-semibold mb-6 relative text-white  " >Welcome to our Live Chat!</h2>


      <p className="text-gray-300 px-6 mb-4 relative" >
        If you have an account,{' '}
        <Link className="text-blue-500 cursor-pointer underline" to={'/Login'} >
          log in here.
        </Link>{' '}
        Otherwise, provide your details to get started.
      </p>


      <form onSubmit={handleSubmit} className='px-6 relative' >

        <div className="mb-4"   >
          <label htmlFor="email" className="block  text-sm font-bold mb-2 text-orange-400 ">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            style={styles.emailInput}
            placeholder='Enter your email here'
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-orange-500"
            required
          />
        </div>

        <div className="mb-4" >
          <label htmlFor="name" className="block  text-sm font-bold mb-2 text-orange-400">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder='Enter your name here'
            value={name}
            style={styles.emailInput}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-orange-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={props.loading}
          className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 focus:outline-none focus:shadow-outline-blue"
        >
         {props.loading?<>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 28,
                    color: "white"
                  }}
                  spin
                />
              }

            />
          
          </>
            :
          <>
            Submit
          </>}
        </button>
      </form>
    </div>
  );
};

export default WelcomeForm;