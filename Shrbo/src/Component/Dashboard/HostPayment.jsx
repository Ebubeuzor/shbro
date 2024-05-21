import React from "react";
import { Tabs } from "antd";
import HostHeader from "../Navigation/HostHeader";
import HostTransactionHistory from "./HostTransactionHistory";
import CompletedPayout from "./CompletedPayout";
import RequestHistory from "../Wallet/PayoutRequestHistory";
import { useStateContext } from "../../ContextProvider/ContextProvider";

const { TabPane } = Tabs;

export default function HostPayment() {
  const {coHost}=useStateContext();
  return (
    <div>
      <HostHeader />
      <div className="m-3 md:w-3/4 md:mx-auto md:my-28">
        <Tabs defaultActiveKey="1">
          {/* <TabPane tab="Completed Payouts" key="1">
            <div><CompletedPayout /></div>
          </TabPane> */}
          <TabPane tab="Transaction History" key="2">
            <div><HostTransactionHistory /></div>
          </TabPane>

          {coHost!=1&&<TabPane tab="Payout Requests" key="3">
            <div>
              <h1 className="text-2xl font-semibold mb-4">
                Payout Requests
              </h1>
              <RequestHistory />

            </div>
          </TabPane>}
        </Tabs>
      </div>
    </div>
  );
}
