import React, { useEffect, useState } from "react";
import { Tabs } from 'antd';
import axios from '../../Axios'
import Payments from './Payments';
import SettingsNavigation from "./SettingsNavigation";
import GoBackButton from "../GoBackButton";
import PayoutBankDetails from './PayoutBankDetails';
import { useStateContext } from "../../ContextProvider/ContextProvider";
import { LoadingOutlined } from '@ant-design/icons';
import { styles } from '../ChatBot/Style'

const PaymentsTab = () => {
    const { user, setUser, setHost, setAdminStatus } = useStateContext();
    // const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Make a request to get the user data
                const response = await axios.get('/user'); // Adjust the endpoint based on your API


                // Set the user data in state
                setUser(response.data);
                setHost(response.data.host);
                setAdminStatus(response.data.adminStatus);


            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                // Set loading to false regardless of success or error
                // setLoading(false);

            }
        };
        if (!user.id) {

            fetchUserData();
        }
    }, []);


    const onChange = (key) => {
        console.log(key);
    };


    const items = [
        {
            key: '1',
            label: 'Payment Cards',
            children: <Payments />,
        },
        {
            key: '2',
            label: 'Payout Bank Acc',
            children: <PayoutBankDetails />,
        },
    ];



    return (

        <div className="max-w-2xl mx-auto p-4">
            <GoBackButton />
            <SettingsNavigation title="Payments & Refunds" text="Payments & Refunds" />
            <p className="text-gray-400 font-normal text-sm my-4">Manage your payment methods and your refund details.
            </p>
           
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>

    );

}
export default PaymentsTab;