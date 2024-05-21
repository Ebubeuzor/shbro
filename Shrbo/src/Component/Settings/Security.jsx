import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import SettingsNavigation from "./SettingsNavigation";
import ChangePassword from "./ChangePassword";
import GoBackButton from "../GoBackButton";
import axios from "../../Axios";
import { message,notification} from 'antd';
import { useStateContext } from "../../ContextProvider/ContextProvider";


export default function Security() {
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isConfirmDeactivation, setIsConfirmDeactivation] = useState(false);
  const {user,setUser,setHost,setAdminStatus}=useStateContext();
  


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make a request to get the user data
        const response = await axios.get('/user'); // Adjust the endpoint based on your API
        

        // Set the user data in state
        setUser(response.data);
        setHost(response.data.host);
        setAdminStatus(response.data.adminStatus);
      

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        // Set loading to false regardless of success or error
        // setLoading(false);
      
      }
    };
    if(!user.id){

      fetchUserData();
    }
  }, []);

  const detailsArray = [
    {
      title: "Login",
      value: "Password",
      action: "Update",
      link: "/edit-name",
    },

    {
      title: " Account",
      value: "Deactivate your account",
      action: "Deactivate Account",
    },
  ];

  const deactivateAccount=async()=>{
    await axios.get("/deactivateAccount").then(response=>{
      localStorage.removeItem("Shbro");
      localStorage.removeItem("A_Status");
      localStorage.removeItem("H_Status");
      window.location.replace('/');
          
    }).catch(err=>{
      console.error("failed to Deactivate account",err);
      message.error("An Error Occured While trying to Deactivate your account ");
    });

    // err.response.data.message
  }
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type,error) => {
      api[type]({
      message: type==="error"?'Error':"Succesfull",
      description:error,
      placement:'topRight',
      className:'bg-green'
  });
  };


  const changePassword=async(data)=>{
      await axios.post('/changePassword',{
        old_password: data.confirmPassword,
        password_confirmation:data.currentPassword,
        newPassword: data.newPassword,
      }).then(response=>{        
        openNotificationWithIcon("success",response.data)
        setIsChangePassword(false);

      }).catch(err=>{
        console.log(err);
        
        if(err.response.data.message){
          openNotificationWithIcon("error",err.response.data.message);

        }else{

          openNotificationWithIcon("error",err.response.data);
        }

      })


  }



  return (
    <div>
      {contextHolder}
      <div className="max-w-2xl mx-auto p-4">
        <GoBackButton/>
        <SettingsNavigation title="Login & security" text="Login & security" />

        <div>
        <p className="text-gray-400 font-normal text-base my-4">        Enhance the security of your account with password and login management options.
</p>

          <div className="tab">
            {isChangePassword && (
              <div className="max-w-2xl mx-auto p-4">
                <h2 className="text-2xl font-medium mb-4">Change Password</h2>
                <ChangePassword
                  onCancel={() => setIsChangePassword(false)}
                  onSave={(updatedPasswordData) => {
                    changePassword(updatedPasswordData);
                  }}
                />
              </div>
            )}
            {detailsArray.map((detail, index) => (
              <div
                className="flex justify-between items-center py-5 border-b"
                key={index}
              >
                <div>
                  <div>
                    <section>
                      <h2>{detail.title}</h2>
                    </section>
                  </div>
                  <div>
                    <span>{detail.value}</span>
                  </div>
                </div>
              {!(detail.title=="Login"&&user.google_id) && <div>
                  {detail.action === "Update" ? (
                    <button
                      className="underline"
                      onClick={() => setIsChangePassword(true)}
                    >
                      {detail.action}
                    </button>
                  ) : detail.action === "Deactivate Account" ? (
                    <>
                      <button
                        className="underline"
                        onClick={() => setIsConfirmDeactivation(true)}
                      >
                        {detail.action}
                      </button>
                    </>
                  ) : (
                    <Link className="underline" to={detail.link}>
                      {detail.action}
                    </Link>
                  )}
                </div>}
              </div>
            ))}

            {isConfirmDeactivation && (
              <div className="bg-white border rounded-md p-4 mt-2">
                <p>Are you sure you want to deactivate your account?</p>
                <button
                  className="bg-red-500 text-white rounded-md py-2 px-4 mt-2"
                  onClick={() => {
                    console.log("Account Deactivated");
                    deactivateAccount()
                    setIsConfirmDeactivation(false);
                  }}
                >
                  Confirm
                </button>
                <button
                  className="text-gray-500 ml-2 mt-2"
                  onClick={() => setIsConfirmDeactivation(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {/* <Link className=" hidden" to={'/Login'} ref={g}  >
                    </Link> */}
        </div>
      </div>
    </div>
  );
}
