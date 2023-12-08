import React from "react";
import SettingsNavigation from "../SettingsNavigation";
import ToggleSwitch from "../../ToggleSwitch";
import SubscriptionManager from "../../SubscriptionManager";

export default function AccountNotifications(props) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <SettingsNavigation title="Notifications" text="Notifications" />

      <div className="space-y-16">
      <p className="text-gray-400 font-normal text-base my-4">      Take control of how and when you receive updates and alerts from Shrbo to stay informed at all times.
</p>

        <div className=" flex items-center space-x-4">
          <div className=" ">
            <div className="bui-switch">
              <ToggleSwitch />
            </div>
          </div>
          <SubscriptionManager
            title="Reservation emails"
            paragraph="Emails you receive after making a reservation. This includes invitations to review the properties you stayed in."
          />
        </div>

        <div className=" flex items-center space-x-4">
          <div className=" ">
            <div className="bui-switch">
              <ToggleSwitch />
            </div>
          </div>
          <SubscriptionManager 
          title="Upcoming booking"
          paragraph="Emails that remind you of your upcoming booking with all the details you need"
          />
        </div>

        <div className=" flex items-center space-x-4">
          <div className=" ">
            <div className="bui-switch">
              <ToggleSwitch />
            </div>
          </div>
          <SubscriptionManager 
          title="Review invites"
          paragraph="Emails inviting you to leave a review on the property you stayed at"
          />
        </div>
      </div>
    </div>
  );
}
