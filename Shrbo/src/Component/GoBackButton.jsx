import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

function GoBackButton() {
  const navigate = useNavigate();

  // Takes you back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button onClick={handleGoBack} className='md:hidden'>
      <IoIosArrowBack /> 
    </button>
  );
}

export default GoBackButton;
