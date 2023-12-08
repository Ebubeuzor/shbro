import React from "react";

export default function TopEarningApartments({ apartments }) {
  // Calculate total earnings for each apartment
  const calculateTotalEarnings = () => {
    return apartments.map((apartment) => {
      const totalEarnings = apartment.earnings.reduce(
        (total, earning) => total + earning.amount,
        0
      );
      return { ...apartment, totalEarnings };
    });
  };

  // Sort apartments by total earnings in descending order
  const sortedApartments = calculateTotalEarnings().sort(
    (a, b) => b.totalEarnings - a.totalEarnings
  );

  return (
    <div>
      <h2 className="text-3xl mb-3">Total Earnings Apartments</h2>
      <ul className="h-[400px] overflow-auto example"> 
        {sortedApartments.map((apartment, index) => (
          <li key={index} className="mb-4 bg-slate-50 shadow-md my-4 space-y-4 p-4 cursor-pointer">
            <div className="flex items-center">
              <img
                src={apartment.image}
                alt={apartment.name}
                className="w-16 h-16 rounded-xl mr-4"
              />
              <div>
                <h3 className="text-xl font-medium">{apartment.name}</h3>
                <p>Date Posted: {apartment.datePosted}</p>
                <p>Total Earnings: ${apartment.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
