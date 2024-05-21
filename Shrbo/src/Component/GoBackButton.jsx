import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { FaArrowLeft } from 'react-icons/fa';

function GoBackButton() {
  const navigate = useNavigate();

  // Takes you back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button onClick={handleGoBack} className='md:hidden'>
         <FaArrowLeft/>
    </button>
  );
}

export default GoBackButton;
