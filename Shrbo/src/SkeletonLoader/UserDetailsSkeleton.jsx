import React from "react";
import HostBottomNavigation from "../Component/Dashboard/HostBottomNavigation";
import HostHeader from "../Component/Navigation/HostHeader";

const UserDetailsSkeleton = () => {
  return (
    <div>
      <HostHeader />
      <HostBottomNavigation />
      <div className="bg-white pb-32 md:w-[80vw] md:mx-auto md:my-20 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex flex-wrap items-center space-x-3 relative animate-pulse">
            <div>
              <div className="bg-gray-200 w-40 h-40 rounded-full"></div>
            </div>
            <div>
              <div className="h-6 bg-gray-200 w-[200px] mb-2"></div>
              <div className="h-6 bg-gray-200 w-[200px] mb-2"></div>
              <div className="h-6 bg-gray-200 w-[200px] mb-2"></div>
            </div>
          </div>

          <button className="bg-gray-200 w-[100px] px-2 py-4  text-gray-400 rounded-md animate-pulse">
     
    </button>
          <div>
            <div className="h-6 bg-gray-200 w-2/4 mb-4 "></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <div className="max-w-xs bg-white h-32  rounded-lg overflow-hidden ">
                <div className="animate-pulse bg-gray-200 h-32 w-full"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 w-full "></div>
                </div>
              </div>
              <div className="max-w-xs bg-white h-32  rounded-lg overflow-hidden m-4">
                <div className="animate-pulse bg-gray-200 h-32 w-full"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 w-full "></div>
                </div>
              </div>
              <div className="max-w-xs bg-white h-32  rounded-lg overflow-hidden m-4">
                <div className="animate-pulse bg-gray-200 h-32 w-full"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 w-full "></div>
                </div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 w-[200px] mb-2"></div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSkeleton;
