import React, { useState } from 'react';
import { Input, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Logo from "../assets/logo.png";
import logoutIcon from "../assets/enter-icon.svg";


const HelpNavigation = () => {
  const [searchValue, setSearchValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const modalContent = (
    <div>
      <h1>Search Results</h1>
      <ul className='space-y-4 mt-4'>
        <li className='flex gap-2 items-center space-x-2'>
          <div className='bg-orange-300 w-fit p-2 rounded-xl'>
            <FontAwesomeIcon icon={faSearch} /> </div>Top articles
        </li>
        <li className='flex gap-2 items-center space-x-2'>
          <div className='bg-orange-300 w-fit p-2 rounded-xl'>
            <FontAwesomeIcon icon={faSearch} /> </div>How cancellations work
        </li>
        <li className='flex gap-2 items-center space-x-2'>
          <div className='bg-orange-300 w-fit p-2 rounded-xl'>
            <FontAwesomeIcon icon={faSearch} /> </div>Check your reservation status as a guest
        </li>
        <li className='flex gap-2 items-center space-x-2'>
          <div className='bg-orange-300 w-fit p-2 rounded-xl'>
            <FontAwesomeIcon icon={faSearch} /> </div>Find the cancellation policy for your stay
        </li>
      </ul>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-50">
      <div className="flex items-center md:w-[90%] justify-between mx-auto">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-10 w-10 mr-2" />
          <div className=" md:block mx-auto">
            <span className=" md:text-2xl">Help Center</span>
          </div>
        </div>
        <div className="md:w-2/3 relative">
          <Input
            placeholder="Search..."
            className="bg-gray-600 text-white rounded-l-lg p-2"
            value={searchValue}
            onChange={handleSearchInputChange}
            onClick={showModal}
          />
          <button
            type="submit"
            className="absolute right-0 top-0 text-white rounded-r-lg p-2"
            onClick={showModal}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className='hidden md:block'>
         <img src={logoutIcon} className='w-4 text-white' alt=""  title='logout'/>
        </div>
      </div>
      <Modal
        title="Top Articles"
        open={modalVisible}
        onCancel={hideModal}
        footer={null}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default HelpNavigation;
