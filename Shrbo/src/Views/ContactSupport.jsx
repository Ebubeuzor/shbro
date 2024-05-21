import React from 'react';
import HelpNavigation from "../Component/HelpNavigation";
import BottomNavigation from '../Component/Navigation/BottomNavigation';
import Footer from '../Component/Navigation/Footer';

const ContactSupport = () => {
  return (
    <div>
        <BottomNavigation/>
      <HelpNavigation/>
      <div className="container pt-24 md:w-[80%] h-[70vh]   mx-auto p-4">
     <div className='pb-32'>
     <h1 className='text-4xl text-center my-10 font-semibold'>Hi Welcome, how can we help?</h1>
        <h1 className="text-2xl font-semibold my-4">Contact and Support Information</h1>

        <p>
          If you have any questions or require assistance, our dedicated support team is here to help you.
        </p>
        <h2>Email</h2>
        <p>For inquiries, you can reach us at info@shortletbooking.com.</p>
        <h2>Telephone</h2>
        <p>Our phone support is available at +2347080646809.</p>
        <h2>Address</h2>
        <p>
          You can also reach us at our physical address:
          18, Akpera Oshi Close, Works And Housing Estate, 3rd Avenue Gwarinpa, Abuja, FCT, Nigeria.
        </p>
     </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ContactSupport;
