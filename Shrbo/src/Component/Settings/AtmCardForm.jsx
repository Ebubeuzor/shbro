import React, { useState } from 'react';

const ATMCardForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }

    if (!/^\d{4}$/.test(expiryDate)) {
      setError('Please enter a valid expiry date in MMYY format.');
      return;
    }

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    const enteredYear = parseInt(expiryDate.substring(2));
    const enteredMonth = parseInt(expiryDate.substring(0, 2));

    if (enteredYear < currentYear || (enteredYear === currentYear && enteredMonth < currentMonth)) {
      setError('Please enter a date that is not expired.');
      return;
    }

    setError('');
    const formData = {
      cardNumber,
      expiryDate,
      cvv,
    };
    console.log('Form Data:', formData);
  };

  const handleCancel = () => {
    setCardNumber('');
    setExpiryDate('');
    setCVV('');
    setError('');
  };

  return (
    <div className="bg-gray-100  flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-96 my-4">
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
              onChange={(e) => setCardNumber(e.target.value)}
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
              onChange={(e) => setExpiryDate(e.target.value)}
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
              max={3}
              value={cvv}
              onChange={(e) => setCVV(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex">
            <button
              type="submit"
              className="w-1/2 mr-2 bg-orange-400 text-white py-2 rounded hover:bg-orange-500"
            >
              Submit
            </button>
            <button
              type="button"
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
