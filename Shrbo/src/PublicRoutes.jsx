import { Outlet,Navigate } from "react-router-dom";

const Public=()=>{

 const token=localStorage.getItem("Shbro");

 return token?<Navigate to={"/"}/>:<Outlet/> ;




}

export default Public;