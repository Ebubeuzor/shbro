import { Navigate, Outlet } from "react-router-dom";

// i used <Outlet/> to get the Children of the Componet because in React Router V6 that's how to access the Children

const Protected = () => {
  const token = localStorage.getItem("Shbro");

  return token ? <Outlet /> : <Navigate to="/Login" />;
};

export default Protected;