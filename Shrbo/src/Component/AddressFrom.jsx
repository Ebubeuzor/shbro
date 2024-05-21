// AddressForm.jsx

import React, { useState, useEffect } from "react";

const AddressForm = ({ onAddressChange }) => {
  const [address, setAddress] = useState("");
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Load the Google Maps API with a callback function
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    return () => {
      // Cleanup: remove the script when the component unmounts
      const script = document.querySelector('script[src*="maps.googleapis.com"]');
      if (script) {
        script.remove();
      }
    };
  }, []); // No need to include initMap in the dependency array

  const initMap = () => {
    // Your initMap function remains the same
    const mapOptions = {
      center: { lat: 0, lng: 0 },
      zoom: 8,
    };

    const newMap = new window.google.maps.Map(document.getElementById("map"), mapOptions);
    setMap(newMap);
  };

  const handleAddressChange = (event) => {
    const newAddress = event.target.value;
    setAddress(newAddress);
    onAddressChange(newAddress); // Call the prop function to notify the parent component

  
    // Use the Google Places API to get the location based on the address entered
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: newAddress }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location); // Set the map center to the new location
        new window.google.maps.Marker({ map, position: location }); // Add a marker to the map
        onAddressChange(newAddress); // Call the prop function to notify the parent component
      } else {
        // Handle geocoding errors here
        console.error("Geocoding failed with status:", status);
        // You may want to provide feedback to the user about the error


      }
    });
  };
  



  return (
    <div>
      <div className="w-[80%] mx-auto my-10">
        <label className="text-xl">Enter your address:</label>
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter your address"
          className="bg-orange-200 my-4 p-4 rounded-full"
        />
      </div>
      <div id="map" style={{ height: "400px", width: "80%", margin: "auto" }}></div>
    </div>
  );
};

export default AddressForm;
