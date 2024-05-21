import React from "react";

export default function MobileThumbNailSlider() {
  return (
    <div className="flex gap-3">
      {" "}
      <div className="skeleton-thumbnail h-16 w-full animate-pulse bg-gray-300 mb-4"></div>
      <div className="skeleton-thumbnail h-16 w-full animate-pulse bg-gray-300 mb-4"></div>
      <div className="skeleton-thumbnail h-16 w-full animate-pulse bg-gray-300 mb-4"></div>
      <div className="skeleton-thumbnail h-16 w-full animate-pulse bg-gray-300 mb-4"></div>
    </div>
  );
}
