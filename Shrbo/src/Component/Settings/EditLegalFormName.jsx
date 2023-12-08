import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axoisClient";

const EditLegalNameForm = ({ onCancel, onSave }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const {user,setUser,token} = useStateContext();
  
  const getUserInfo = () => {
    axiosClient.get('user')
    .then((data) => {
      setUser(data.data);
      const fullName = user.name;
      const [userFirstName, userLastName] = fullName.split(' ');
      setFirstName(userFirstName);
      setLastName(userLastName);
    })
  }
  
  useEffect(() => {
    getUserInfo();
  },[]);

  const handleSubmit = (e) => {
    e.preventDefault();
   
    onSave({ firstName, lastName });
  };

  console.log(user.name);

  return (
    <form name="legalName" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="first_name" className="block font-medium">
          First name
        </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border rounded-md py-2 px-3 w-full"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="last_name" className="block font-medium">
          Last name
        </label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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

export default EditLegalNameForm;
