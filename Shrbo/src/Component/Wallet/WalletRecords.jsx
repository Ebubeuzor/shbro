import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import GoBackButton from "../GoBackButton";
import RequestHistory from './PayoutRequestHistory';
import WalletHistory from './WalletHistory';
import { useParams } from 'react-router-dom';




const WalletRecords = () => {
    const [activeKey, setActiveKey] = useState("1");
    const { id } = useParams();// to determine the active key 
    const onChange = (key) => {
        setActiveKey(key)
    };
    const items = [
        {
            key: '1',
            label: 'Payout Request',
            children: <RequestHistory />,
        },
        {
            key: '2',
            label: 'Wallet History',
            children: <WalletHistory />,
        },

    ];

    useEffect(() => {

        if (id === "WalletHistory") {
            setActiveKey("2")
        }

    }, [id]);



    return (
        <div className='max-w-2xl mx-auto p-4'>
            <GoBackButton />
            <div className="mt-3">
                <h1 className="text-3xl">Wallet Records</h1>
            </div>
            {/* <SettingsNavigation title="Payments & Refunds" text="Payments & Refunds" /> */}
            <p className="text-gray-400 font-normal text-sm my-4">
                View your wallet records here to track all financial transactions, including incoming and outgoing payments, and manage payment requests efficiently.
            </p>

            <Tabs defaultActiveKey={activeKey} activeKey={activeKey} items={items} onChange={onChange} />

        </div>
    )
};

export default WalletRecords;