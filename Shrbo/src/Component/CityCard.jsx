import React from 'react';

const CityCard = ({ name, description, image, facts, destinations }) => {
  return (
    <div className="city-card mx-1 bg-white p-4 m-4  rounded-lg  shadow-md">
      <img src={image} alt={name} className="w-full h-72 object-cover rounded mb-4" />
     
      <div className='h-[50vh] overflow-scroll pb-10 example'>
      <h2 className="text-2xl font-semibold mb-2">{name}</h2>
      <p className="text-gray-700 mb-4">{description}</p>

      <div className="city-facts mb-4">
        <h3 className="text-lg font-semibold mb-2">Facts:</h3>
        <ul>
          {facts.map((fact, index) => (
            <li key={index} className="mb-2">{fact}</li>
          ))}
        </ul>
      </div>

      <div className="city-destinations">
        <h3 className="text-lg font-semibold mb-2">Destinations:</h3>
        <ul>
          {destinations.map((destination, index) => (
            <li key={index} className="mb-2">{destination}</li>
          ))}
        </ul>
      </div>
      </div>
      {/* You can add more sections and style them as needed */}
    </div>
  );
};

export default CityCard;
