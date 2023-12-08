import React, { useEffect, useState } from "react";
import axiosClient from "../../axoisClient";
import { useStateContext } from "../../context/ContextProvider";

const EditEmailAddress = ({ onCancel, onSave }) => {
  const [email, setEmail] = useState("");
  const {user,setUser,token} = useStateContext();
  
  const getUserInfo = () => {
    axiosClient.get('user')
    .then((data) => {
      setUser(data.data);
      setEmail(user.email);
    })
  }
  
  useEffect(() => {
    getUserInfo();
  },[]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({ email });
  };

  const disabled = user.google_id == null ? false : true;

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
          disabled={disabled}
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
