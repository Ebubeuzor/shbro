import React, { useState } from "react";

function AddressForm({ onCancel, onSave }) {
  const [country, setCountry] = useState();
  const [street, setStreet] = useState();
  const [zipCode, setZipCode] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const addressData = {
      country,
      street,
      zipCode,
      state,
      city,
    };

    if(addressData.length===0){
      return
    }

    onSave(addressData);
  };

  return (
    <form onSubmit={handleSaveAddress}>
      <label htmlFor="addressCountry">Country/Region:</label> <br />
      <select
        name="country"
        id="addressCountry"
        className="border p-2"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      >
        <option value="">Select a Country</option>
        <option value="USA">United States</option>
        <option value="Canada">Canada</option>
        <option value="Nigeria">Nigeria</option>
        {/* Add more country options */}
      </select>
 <br />
      <label htmlFor="addressStreet">Street address:</label>
      <input
        type="text"
        id="addressStreet"
        value={street}
        className="border p-2"
        onChange={(e) => setStreet(e.target.value)}
      />

      <label htmlFor="addressZipCode">Zip Code:</label>
      <input
        type="text"
        id="addressZipCode"
        value={zipCode}
        className="border p-2"
        onChange={(e) => setZipCode(e.target.value)}
      />

      <label htmlFor="addressState">State:</label>
      <input
        type="text"
        id="addressState"
        value={state}
        className="border p-2"
        onChange={(e) => setState(e.target.value)}
      />

      <label htmlFor="addressCity">City:</label>
      <input
        type="text"
        id="addressCity"
        value={city}
        className="border p-2"
        onChange={(e) => setCity(e.target.value)}
      />

      <div className="mt-4">
        <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded">
          Save
        </button>
        <button type="button" onClick={onCancel} className="ml-2 text-gray-500">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddressForm;
