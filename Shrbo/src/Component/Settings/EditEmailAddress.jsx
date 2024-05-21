import React, { useState } from "react";

const EditEmailAddress = ({ onCancel, onSave }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {

   if(email===""){
     return

   } 

    e.preventDefault();

    onSave({ email });
  };

  return (
    <form name="legalName" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="first_name" className="block font-medium">
          Email Address
        </label>
        <input
          type="text"
          id="email_address"
          name="email_address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-md py-2 px-3 w-full"
          required
        />
      </div>
   
      <div className="text-right">
        <button
          type="button"
          className="text-gray-500 mr-4"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="bg-orange-400 text-white rounded-md py-2 px-4">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditEmailAddress;
