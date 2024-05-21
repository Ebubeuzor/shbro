import React, { useState } from 'react';
import axios from '../../Axios'
import { message} from 'antd';
import {LoadingOutlined}  from '@ant-design/icons';
import {styles} from '../ChatBot/Style'
const ATMCardForm = ({ close,userId,refresh }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [error, setError] = useState('');
  const [loading,setLoading]=useState(false);
  

  message.config({
    duration: 5,
  });

  
  
  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedInput = input
      .substring(0, 16)
      .replace(/(.{4})/g, '$1 ') // Insert space after every 4 characters
      .trim(); // Remove trailing space
    setCardNumber(formattedInput);
  };




  const handleExpiryDateChange =  (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedInput =
      input.length <= 2
        ? input
        : `${input.substring(0, 2)}/${input.substring(2, 4)}`; // Format MM/YY

    setExpiryDate(formattedInput);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

      // Remove the slash from expiryDate before putting it in the formData object
     const formattedExpiryDate = expiryDate.replace('/', '');
     const formattedCardNumber = cardNumber.replace(/\s/g, '');
    setError('');
    const formData = {
      card_number:formattedCardNumber,
      expiry_data:formattedExpiryDate,
      CVV:cvv,
    };
    console.log('Form Data:', formData);

    await axios.post(`/createCard/${userId}`,formData).then((response)=>{
          console.log(response.data);
          message.success(`Your card was added successfully`);
          setLoading(false);
          close(false);
          refresh();
    }).catch(err=>{
      console.error('Error  creating card:', err);
      if(err.response.data.message){
        setError(err.response.data.message);
        message.error(err.response.data.message);
      }else{
        setError(err.response.data);
        message.error(err.response.data);
      }
      setLoading(false);
    });





  };



  const handleCancel = () => {
    setCardNumber('');
    setExpiryDate('');
    setCVV('');
    setError('');
    close(false);
  };




  return (
    <div className="bg-gray-100  flex justify-center items-center">
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
                        fontSize:'52px',
                        top:'calc(50% - 171px)',
                        left:'calc(50% - 21px)',


                    }
                
                
                }}
            />

      <div className="bg-white p-6 rounded shadow-md w-96 my-4 ">
        <h2 className="text-2xl font-semibold mb-4">ATM Card Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-gray-600">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              className="w-full p-2 border rounded"
              placeholder="Enter card number"
              value={cardNumber}
              disabled={loading?true:false}
              onChange={handleCardNumberChange}
              maxLength={19}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="expiryDate" className="block text-gray-600">
              Expiry Date (MMYY)
            </label>
            <input
              type="text"
              id="expiryDate"
              className="w-full p-2 border rounded"
              placeholder="MMYY"
              value={expiryDate}
              disabled={loading?true:false}
              onChange={handleExpiryDateChange}
              maxLength={5}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cvv" className="block text-gray-600">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              className="w-full p-2 border rounded"
              placeholder="Enter CVV"
              maxLength={3}
              value={cvv}
              disabled={loading?true:false}
              onChange={(e) => setCVV(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex">
            <button
              type="submit"
              className="w-1/2 mr-2 bg-orange-400 text-white py-2 rounded hover:bg-orange-500"
              disabled={loading?true:false}
            >
              Submit
            </button>
            <button
              type="button"
              disabled={loading?true:false}
              className="w-1/2 ml-2 text-black  py-2 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ATMCardForm;
