import axios from "../../Axios";
import React, { useState, useEffect } from "react";
import { Table} from 'antd';



const WalletHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 }); 

    const columns = [
        {
            title: 'Payment Title',
            dataIndex: 'from',
            key: 'from',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Listing',
            dataIndex: 'for',
            key: 'for',
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => <p className=" text-green-400"> +{text}</p>,
        },
        {
            title: 'Date',
            dataIndex: 'time',
            key: 'time',
        },

    ];





    useEffect(() => {
        setLoadingTransactions(true);



        fetchWalletTransactions();

    }, []);


    function formatAmountWithCommas(amount) {
        // Convert the amount to a string and split it into integer and decimal parts
        const [integerPart, decimalPart] = amount.toString().split('.');

        // Add commas to the integer part
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Combine the integer and decimal parts with a dot if there is a decimal part
        const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

        return formattedAmount;
    }

    function formatDate(inputDate) {
        const date = new Date(inputDate); // Parse the input date string
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if necessary
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (zero-based) and pad with leading zero if necessary
        const year = date.getFullYear(); // Get full year
        const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero if necessary
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero if necessary

        // Return formatted date string in "DD/MM/YYYY HH:mm" format
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }



    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };




    const fetchWalletTransactions = async () => {

        try {
            const response = await axios.get(`/viewUserWalletRecords`);

            // Extracting and formatting data
            const formattedTransactions = Object.entries(response.data.wallet_records).flatMap(([title, walletRecord]) => {
                return walletRecord.records.map(record => ({
                    key: record.id,
                    id: record.id,//d
                    status: "Incoming", // Assuming status is always "Incoming" for this format
                    from: `Shbro,${walletRecord.title}`,  //d
                    for: record.hosthome_title, // Determine "for" value based on the presence of hosthome  //d
                    amount: formatAmountWithCommas(record.amount),//d
                    time: formatDate(record.created_at)//d
                }));
            });


            setTransactions(formattedTransactions)

            console.log("check", formattedTransactions);

        } catch (error) {

            console.error(error);

        } finally {
            setLoadingTransactions(false);
        }


    }

    return (
        <div className="   ">
            <div className="overflow-auto example">
                {/* <h1 className="text-2xl font-semibold mb-4">Payout Request History</h1> */}

                <div className="bg-white  rounded shadow">
                    <div className="overflow-x-auto">
                        {/* <Table columns={columns} pagination={tableParams.pagination} onChange={handleTableChange} dataSource={dataSource} loading={loading} /> */}
                        <Table
                            columns={columns}
                            dataSource={transactions}
                            loading={loadingTransactions}
                            pagination={pagination}
                            onChange={handleTableChange} />
                    </div>
                </div>
            </div>

        </div>
    );




};
export default WalletHistory;