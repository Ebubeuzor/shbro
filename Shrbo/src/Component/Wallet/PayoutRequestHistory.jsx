import axios from "../../Axios";
import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Popconfirm, message } from 'antd';





const RequestHistory = () => {
    const [paymentRequest, setPaymentRequests] = useState([]);
    const [loadingRequest, setLoadingRequest] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

    const columns = [
        {
            title: 'Name on Account',
            dataIndex: 'account_name',
            key: 'account_name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Bank',
            dataIndex: 'bank_name',
            key: 'bank_name',
        },
        {
            title: 'Request ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Approval',
            key: 'approvedStatus',
            dataIndex: 'approvedStatus',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = 'green';
                        if (tag === null || tag.toUpperCase() != "APPROVED") {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag ? tag.toUpperCase() : "PENDING"}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    {/* <a>Invite {record.name}</a> */}
                    {!record.approvedStatus &&
                        <Popconfirm
                            title="Cancel Request"
                            description={`Sure you want to cancel this payout request ?`}
                            onConfirm={(e) => { confirm(e, record.id) }}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="Cancel"
                        >
                            <Button >Cancel</Button>
                        </Popconfirm>

                    }
                </>
            ),
        },
    ];

    //Confirm cancelling Request
    const confirm = async (e, id) => {
        // console.log(e);

        await axios.get(`/cancelPayRequest/${id}`).then(response => {
            console.log(response);
            message.success(`Cancelled request`);
            fetchWalletWithdrawRequsts();
            // openViewCohostModal();
        }).catch(error => {
            console.error("Failed to Cancel request", error);
            if (error.response.data.message) {
                message.error(error.response.data.message)

            } else {
                message.error(error.response.data);

            }
        })

    };
    const cancel = (e) => {
        console.log();
    };

    useEffect(() => {
        setLoadingRequest(true);


        // fetchUserCards();
        // fetchWalletBalance()
        fetchWalletWithdrawRequsts();
        // fetchWalletTransactions();

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



    const fetchWalletWithdrawRequsts = async () => {
        setLoadingRequest(true);

        try {
            const response = await axios.get(`/getUserPaymentRecords`);

            const formattedTransactions = response.data.payment_records.map((data) => ({
                key: data.id,
                id: data.id,
                user_id: data.user_id,
                account_number: data.account_number,
                account_name: data.account_name,//d
                amount: formatAmountWithCommas(data.amount),//d
                bank_name: data.bank_name,//d
                approvedStatus: data.approvedStatus,//d
                created_at: formatDate(data.created_at),//d
                tags: [data.approvedStatus]



            }));

            console.log(response.data)
            setPaymentRequests(formattedTransactions);

        } catch (error) {
            console.error(error)

        } finally {

            setLoadingRequest(false);
        }


    }

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };


    return (
        <div className="   ">
            <div className="overflow-auto example">
                {/* <h1 className="text-2xl font-semibold mb-4">Payout Request History</h1> */}

                <div className="bg-white  rounded shadow">
                    <div className="overflow-x-auto">
                        {/* <Table columns={columns} pagination={tableParams.pagination} onChange={handleTableChange} dataSource={dataSource} loading={loading} /> */}
                        <Table
                            columns={columns}
                            dataSource={paymentRequest}
                            loading={loadingRequest}
                            pagination={pagination}
                            onChange={handleTableChange}

                        />
                    </div>
                </div>
            </div>

        </div>
    );




};
export default RequestHistory;