import React,{useState} from 'react'

export default function ChangePassword({ onCancel, onSave }) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPasswordPassword] = useState("");


    
    const handleSubmit = (e) => {
      e.preventDefault();
    
      onSave({currentPassword, newPassword, confirmPassword });
    };
  return (
    <form name="legalName" onSubmit={handleSubmit}>
    <div className="mb-4">
      <label htmlFor="first_name" className="block font-medium">
        Current Password
      </label>
      <input
        type="text"
        id="current_password"
        name="current_password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="border rounded-md py-2 px-3 w-full"
        required
      />
    </div>

    <label htmlFor="new_password" className="block font-medium">
       New Password
      </label>
      <input
        type="text"
        id="new_password"
        name="new_password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border rounded-md py-2 px-3 w-full"
        required
      />


<label htmlFor="confirm_password" className="block font-medium">
       Confirm Password
      </label>
      <input
        type="text"
        id="confirm_password"
        name="confirm_password"
        value={confirmPassword}
        onChange={(e) => setConfirmPasswordPassword(e.target.value)}
        className="border rounded-md py-2 px-3 w-full"
        required
      />
 
    <div className="text-right mt-4">
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
  )
}
