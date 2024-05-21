import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from '../Axios'
import { useStateContext } from "../ContextProvider/ContextProvider";

const WishlistModal = ({ added, onClose, closable,listingId,wishlistContainer }) => {
  const [selectedWishlist, setSelectedWishlist] = useState("");
  const [newWishlist, setNewWishlist] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  // const [wishlistContainer,setWishlistContainer]=useState([]);
  const {user}=useStateContext();
  

  // useEffect(()=>{
  //   axios.get("/getUserWishlistContainers").then(response=>{
  //     setWishlistContainer(response.data.userWishlist);
  //     console.log("wishlist",response.data);

  //   }).catch(error=>{
  //     console.log("wishlist",error)
  //   });

  // },[]);
  

  useEffect(() => {
    if (isAdded) {
      const toastMessage = selectedWishlist || newWishlist
        ? "Added to Wishlist"
        : "Please select or enter a wishlist name";

      toast.success(toastMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
      setIsAdded(false); // Reset isAdded after showing the toast
    }
  }, [isAdded, selectedWishlist, newWishlist]);

  const toggleFav = (type) => {
    if(type==="success"){
      toast.success("Added to Wishlist", {
        position: toast.POSITION.TOP_CENTER,
      });

    }else if(type==="error"){
      toast.error("Error Adding to Wishlist", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const userId = localStorage.getItem('receiverid'); // Assuming 'userId' is stored in local storage
console.log(userId);

  const handleAddToWishlist = async() => {

      if(newWishlist===""&&selectedWishlist===""){
        return
      }

    const data={
      containername:newWishlist?newWishlist:"",
      wishcontainerid:selectedWishlist?selectedWishlist:"",
      hosthomeid:listingId,
    }

    console.log(data)
    added()
    
    await axios.post(`/createWishlist/${user.id || userId}`,data).then(response=>{
      toggleFav("success");
      
    }).catch(error=>{
      console.log('ADDing to Wishlist',error)
      toggleFav("error");
      handleCancel()
    });

  };


  


  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="bg-black opacity-50 fixed inset-0"></div>
      <div className="bg-white w-96 p-6 rounded-md z-10">
        {closable && (
          <span
            className="text-gray-700 text-2xl font-bold cursor-pointer absolute top-2 right-2"
            onClick={handleCancel}
          >
            &times;
          </span>
        )}
        <h2 className="text-xl font-bold mb-4">Select or Create Wishlist</h2>
        <form>
        {wishlistContainer && (
            <label className="block mb-2">
              Select Wishlist:
              <select
                className="w-full p-2 border rounded"
                value={selectedWishlist}
                onChange={(e) => {setSelectedWishlist(e.target.value);setNewWishlist("")}}
              >
                <option value="">-- Select Wishlist --</option>
                {/* <option value="wishlist1">Wishlist 1</option>
                <option value="wishlist2">Wishlist 2</option> */}
                {wishlistContainer.map((cont) => (
                  <option key={cont.id} value={cont.id}>
                    {cont.name}
                  </option>
                ))}
              </select>
         </label>
)}

        {selectedWishlist==="" && <label className="block mb-2">
            Create New Wishlist:
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newWishlist}
              onChange={(e) => setNewWishlist(e.target.value)}
            />
          </label>}
          <div className="flex justify-between">
            <button
              type="button"
              className={`bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-700 ${
                isAdded ? "cursor-not-allowed" : ""
              }`}
              onClick={handleAddToWishlist}
              disabled={isAdded}
            >
              Add to Wishlist
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default WishlistModal;
