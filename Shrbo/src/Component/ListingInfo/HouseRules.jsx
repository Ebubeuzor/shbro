import React ,{ useState } from "react";
import { Tabs } from 'antd';
import HouseRulesTab from "./HouseRulesTab";
import CancellationPolicyTab from "./CancellationPolicyTab";
import DamagesTab from "./DamagesTab";



const items = [
  {
    key: '1',
    label:  
    <div className=" w-full h-full  k ">
        House Rules
    </div>,
    children: <HouseRulesTab/>,
  },
  {
    key: '2',
    label:<div className=" w-full h-full   ">Damage and incidentals</div> ,
    children: <DamagesTab/>,
  },
  {
    key: '3',
    label: <div className=" w-full h-full   ">Cancellation Policy </div>,
    children:<CancellationPolicyTab/>,
  },
];



const HouseRules=()=>{

  const onChange = (key) => {
    console.log(key);
  };
        

        return(
              <div className=" py-3 mb-6   " >
                <div className="mb-"></div>
                <p className="text-2xl w-[90%] mb-4 lg:mb-6  font-semibold block box-border  bg-white ">House Rules & Important Information</p>
                  
                  <div>
                      <Tabs defaultActiveKey="1" 
                      items={items} 
                      onChange={onChange} 
                      
                      type="card" />

                  </div>

                 
             
                

              </div>
        );

 }

export default HouseRules;