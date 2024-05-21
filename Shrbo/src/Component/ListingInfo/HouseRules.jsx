import React from "react";
import { Tabs } from 'antd';
import HouseRulesTab from "./HouseRulesTab";
import CancellationPolicyTab from "./CancellationPolicyTab";
import DamagesTab from "./DamagesTab";

const { TabPane } = Tabs;

const items = [
  {
    key: '1',
    label: 'House Rules',
    children: <HouseRulesTab />,
  },
  {
    key: '2',
    label: 'Damage and Incidentals',
    children: <DamagesTab />,
  },
  {
    key: '3',
    label: 'Cancellation Policy',
    children: <CancellationPolicyTab />,
  },
];

const HouseRules = () => {
  const onChange = (key) => {
    console.log(key);
  };

  return (
    <div className="py-3 mb-6">
      <p className="text-2xl w-[90%] mb-4 lg:mb-6 font-semibold block box-border bg-white">House Rules & Important Information</p>
      <div>
        <Tabs defaultActiveKey="1" onChange={onChange} type="card" items={items} />
      </div>
    </div>
  );
};

export default HouseRules;
