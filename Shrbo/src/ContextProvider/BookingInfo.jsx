import React, { createContext, useContext, useState } from "react";

const DateContext = createContext();

export const useDateContext = () => useContext(DateContext);

export const BookingInfoData = ({ children }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [pets, setPets] = useState(0);
  const [hostFees, setHostFees] = useState(0); // New state variable for host fees
  const [serviceFee, setServiceFee] = useState(0); // New state variable for service fee
  const [tax, setTax] = useState(0); // New state variable for tax
  const [totalPrice, setTotalPrice] = useState(0); // New state variable for total price
  const [totalCost, setTotalCost] = useState(0); 
  const [housePrice,setHousePrice] = useState(0);
  const [nights,setNights] = useState(0);
  const [title, setTitle] = useState(""); // New state variable for title
  const [cancellationPolicy, setCancellationPolicy] = useState(""); 
  const [address, setAddress] = useState(""); // New state variable for address
  const [photo, setPhoto] = useState([]); // New state variable for photo
  const [apartment, setApartment] = useState(null); // New state variable for apartment
  const [user, setUser] = useState(null); // Add user state variable and its setter
  const [securityDeposit, setSecurityDeposits] = useState(0); // New state variable for security deposit
  const [discounts, setDiscounts] = useState([]); // New state variable for discounts
  const [appliedDiscounts, setAppliedDiscounts] = useState("");

  return (
    <DateContext.Provider
      value={{
        checkInDate,
        setCheckInDate,
        checkOutDate,
        setCheckOutDate,
        adults,
        setAdults,
        pets,
        setPets,
        hostFees, 
        setHostFees,
        serviceFee, 
        setServiceFee, 
        tax, 
        setTax,
        totalPrice,
        setTotalPrice, 
        totalCost,
        setTotalCost, 
        housePrice,
        setHousePrice,
        nights,
        setNights,
        title, 
        setTitle, 
        cancellationPolicy, 
        setCancellationPolicy, 
        address,
        setAddress, 
        photo, 
        setPhoto, 
        apartment, 
        setApartment,
        user,
        setUser,
        securityDeposit,
        setSecurityDeposits, 
        discounts,
        setDiscounts,
        setAppliedDiscounts,
        appliedDiscounts
      }}
    >
      {children}
    </DateContext.Provider>
  );
};
