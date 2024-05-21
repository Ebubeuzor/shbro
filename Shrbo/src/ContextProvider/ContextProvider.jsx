import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  adminStatus: null,
  host: null,
  coHost:null,
  setUser: () => {},
  setToken: () => {},
  setAdminStatus: () => {},
  setHost: () => {},
  setCoHost: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem("Shbro"));
  const [adminStatus, _setAdminStatus] = useState(localStorage.getItem("A_Status"));
  const [host, _setHost] = useState(localStorage.getItem("H_Status"));
  const [coHost, _setCoHost] = useState(localStorage.getItem("CH_Status"));

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("Shbro", token);
    
    } else {
      localStorage.removeItem("Shbro");
    }
  };

  const setAdminStatus=(status)=>{
    _setAdminStatus(status);
    if (status) {

      localStorage.setItem("A_Status",status);
    } else {
      localStorage.removeItem("A_Status");
   
    }

  }

  const setHost=(status)=>{
  _setHost(status)
  if (status) {
    localStorage.setItem("H_Status",status);
  } else {
    localStorage.removeItem("H_Status");
  }
  }
  const setCoHost=(status)=>{
  _setCoHost(status)
  if (status) {
    localStorage.setItem("CH_Status",status);
  } else {
    localStorage.removeItem("CH_Status");
  }
  }



  return (
    <StateContext.Provider
      value={{
        user,
        token,
        adminStatus,
        host,
        coHost,
        setUser,
        setToken,
        setAdminStatus,
        setHost,
        setCoHost,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
