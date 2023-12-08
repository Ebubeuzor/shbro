import React from "react";
import { Tabs } from "antd";
import HostHeader from "../Navigation/HostHeader";
import HostPayoutRequests from "./HostPayoutRequests";
import HostTransactionHistory from "./HostTransactionHistory";
import CompletedPayout from "./CompletedPayout";

const { TabPane } = Tabs;

export default function HostPayment() {
  return (
    <div>
      <HostHeader />
      <div className="m-3 md:w-3/4 md:mx-auto md:my-28">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Completed Payouts" key="1">
            <div><CompletedPayout/></div>
          </TabPane>
          <TabPane tab="Transaction History" key="2">
            <div><HostTransactionHistory/></div>
          </TabPane>
          {/* <TabPane tab="Payout Requests" key="3">
            <div><HostPayoutRequests/></div>
          </TabPane> */}
        </Tabs>
      </div>
    </div>
  );
}
