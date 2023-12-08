import React from "react";
import Header from "../Navigation/Header";
import BottomNavigation from "../Navigation/BottomNavigation";
import HostDashboardSidebar from "../Navigation/HostDashboardSidebar";

export default function ManageListings() {
  return (
    <div>
      <div>
        <Header />
        <div>
            <HostDashboardSidebar/>
        </div>

        <BottomNavigation />
      </div>
    </div>
  );
}
