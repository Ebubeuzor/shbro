import 'react-phone-number-input/style.css'
import PhoneInput, {isValidPhoneNumber } from 'react-phone-number-input';


import React, { useState } from "react";

const EditPhoneNumber = ({ onCancel, onSave }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if(phoneNumber.length===0){
      return
    }
  
    onSave({ phoneNumber });
  };

  return (
    <form name="legalName" onSubmit={handleSubmit}>
     <PhoneNumberValidation phoneNumber={phoneNumber} onCancel={onCancel} setPhoneNumber={(a)=>{setPhoneNumber(a)}}/>
    </form>
  );
};

export default EditPhoneNumber;





const PhoneNumberValidation = ({phoneNumber,setPhoneNumber,onCancel}) => {
  // const [phoneNumber, setPhoneNumber] = useState('');
  const [valid, setValid] = useState(true);

  const handleChange = (value) => {
    setPhoneNumber(value);
    setValid(validatePhoneNumber(value));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;

    return phoneNumberPattern.test(phoneNumber);
  };

  return (
    <div>
      <div >

      <div className=' w-80'>
        {/* Phone Number: */}
        <PhoneInput
            defaultCountry="NG"
            className=' h-10'
          placeholder={'00-000-00'}
          international
          countryCallingCodeEditable={false}
          value={phoneNumber}
          onChange={handleChange}
        
          error={phoneNumber ? (isValidPhoneNumber(phoneNumber) ? undefined : 'Invalid phone number') : 'Phone number required'}
          />
      </div>
      {!(phoneNumber && isValidPhoneNumber(phoneNumber)&&valid) && (
        <p className=' text-red-600'>Please enter a valid phone number.</p>
        )}

        </div>

      <div className="text-right">
        <button
          type="button"
          className="text-gray-500 mr-4"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button disabled={(phoneNumber && isValidPhoneNumber(phoneNumber))?false:true} type="submit" className="bg-orange-400 disabled:cursor-not-allowed text-white rounded-md py-2 px-4">
          Save
        </button>
      </div>
    </div>
  );
};
