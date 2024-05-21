import React, { useState, useEffect } from "react";
import { useStateContext } from "../../ContextProvider/ContextProvider";
import axios from '../../Axios'
import { message, Popconfirm, Tag } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { styles } from '../ChatBot/Style'
import AccountNumberForm from "./ProfileCardSettings/AccountNumberForm";





export default function PayoutBankDetails() {

    const [isChangeAccountNumber, setIsChangeAccountNumber] = useState(false);
    const { user } = useStateContext();
    const [loading, setLoading] = useState(false);
    const [acLoading, setAcLoading] = useState(false);
    const [supportedBanks, setSupportedBanks] = useState([]);
    const [accountDetails, setAccountDetails] = useState([])
    const detailsArray = [
        {
            title: "Account details",
            value: "Add Bank Details for Refund",
            action: "Add",
            link: "/edit-name",
        },
        ...accountDetails,

    ];


    const cancel = (e) => {
        console.log();
    };


    message.config({
        duration: 5,
    });

    useEffect(() => {

        fetchUserData();

    }, []);


    const fetchUserData = async () => {
        setLoading(true)
        try {
            // Make a request to get the user data
            const response = await axios.get(`/getUserBankInfos/${user.id}`);
            // Adjust the endpoint based on your API
            console.log(response.data);

            // const data = {
            //     title: response.data.data[0].bank_name,
            //     value: response.data.data[0].account_number,
            //     action: response.data.data[0].account_name,

            // }
            const newDetails = response.data.data.map((acc) => {
                const formattedCreatedAt = new Date(acc.created_at).toLocaleString();
                return {
                    title: acc.bank_name,
                    value: `**** **** **** ${acc.account_number.slice(-4)}`,
                    action: acc.account_name,
                    link: "",
                    id: acc.id,
                    card: true,
                    created_at: formattedCreatedAt,
                    selected: acc.selected,
                };
            });

            setAccountDetails(newDetails);




        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            // Set loading to false regardless of success or error
            setLoading(false);

        }
    };



    const handleAccountNumber = async (data) => {

        const details = {
            account_number: data.accountNumber,
            bank_name: data.bankName,
            account_name: data.fullName,
        }

        await axios.post(`/createUserBankinfo/${user.id}`, details).then((response) => {

            console.log(response);
            message.success(`Account Details added successfully`);
            fetchUserData();
        }).catch(error => {
            console.error("Failed to add Account detalis", error);
            message.error(`An Error Occured while trying to add Account detais ${type}`)
        }).finally(() => {
            setAcLoading(false)
            setIsChangeAccountNumber(false);
        });


    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Make a request to get the user data
                const response = await axios.get(`/listBanks`);
                const formattedBanks = response.data.map((bank) => ({
                    value: bank,
                    label: bank,

                }));
                setSupportedBanks(formattedBanks);

            } catch (error) {
                console.error('Error fetching supported banks:', error);
            } finally {
                // Set loading to false regardless of success or error
                // setLoading(false);

            }
        };


        fetchUserData();

    }, []);


    const confirm = async (e, type, bankId) => {
        // console.log(e);

        await axios.delete(`/deleteUserBankInfo/${user.id}/${bankId}`).then(response => {
            console.log(response);
            message.success(`Bank info Removed successfully`);
            fetchUserData();
        }).catch(error => {
            console.error("Failed to Remove Bank info", error);
            message.error(`An Error Occured while trying to Remove bank info `)
        })

    };

    const selectCard = async (cardId, type) => {

        toggleSelected(cardId);

        await axios.get(`/selectBankInfo/${cardId}/${user.id}`).then(response => {
            console.log(response);
            message.success(`Account ${type} Selected successfully`);
        }).catch(err => {
            console.error("Failed to Selected Card", err);
            message.error(`An Error Occured while trying to Select Card ${type}`)
            toggleSelected(cardId);

        })

    }

    const toggleSelected = (cardId) => {
        setAccountDetails((prevAccountDetails) =>
            prevAccountDetails.map((accountDetail) => {
                // Check if the current paymentDetail has the same id as the parameter


                if (accountDetail.id === cardId) {
                    // Toggle the selected field
                    return { ...accountDetail, selected: accountDetail.selected === 'Selected' ? null : 'Selected' };
                } else if (accountDetail.selected !== null) {
                    // Deselect any previously selected item
                    return { ...accountDetail, selected: null };
                }
                // Keep other paymentDetails unchanged
                return accountDetail;
            })
        );

    }






    return (
        <div>
            {loading ?
                <>

                    <div
                        className="transition-3"
                        style={{
                            ...styles.loadingDiv,
                            ...{
                                zIndex: loading ? '10' : '-1',
                                display: loading ? "block" : "none",
                                opacity: loading ? '0.33' : '0',
                            }
                        }}

                    />
                    <LoadingOutlined
                        className="transition-3"
                        style={{
                            ...styles.loadingIcon,
                            ...{
                                zIndex: loading ? '10' : '-1',
                                display: loading ? "block" : "none",
                                opacity: loading ? '1' : '0',
                                fontSize: '42px',
                                top: 'calc(50% - -41px)',
                                left: 'calc(50% - 41px)',


                            }


                        }}
                    />
                </>
                :
                <div className="max-w-2xl mx-auto ">



                    <div>
                        <div className="tab">
                            {isChangeAccountNumber && (
                                <div className="max-w-2xl mx-auto p-4">
                                    <h2 className="text-2xl font-medium mb-4">Account Details</h2>
                                    <AccountNumberForm close={(bool) => { setIsChangeAccountNumber(bool) }} loading={acLoading} Submit={(val) => { handleAccountNumber(val) }} banks={supportedBanks} />
                                </div>
                            )}

                            {detailsArray.map((detail, index) => (
                                <div
                                    className="flex justify-between items-center py-5 border-b"
                                    key={index}
                                >

                                    {!detail.card ?
                                        <>
                                            <div>
                                                <div>
                                                    <section>
                                                        <h2>{detail.title}</h2>
                                                    </section>
                                                </div>
                                                <div>
                                                    <span>{detail.value}</span>
                                                </div>
                                            </div>
                                            <div>

                                                <button
                                                    className="underline"
                                                    onClick={() => { setIsChangeAccountNumber(true)}}
                                                >
                                                    {detail.action}
                                                </button>

                                            </div>
                                        </> :
                                        <div className=" min-[640px]:justify-between min-[640px]:items-start min-[640px]:flex py-5 px-6 bg-[rgb(249,250,251)] rounded-md w-full relative" >
                                            {/* <h4 className=" absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap ">{detail.card_type}</h4> */}
                                            {(detail.selected == "Selected") && <Tag bordered={true} color="success" className=" min-[640px]:text-[10px] max-[639px]:right-2 min-[640px]:left-3 min-[640px]:bottom-1 absolute min-[640px]:leading-4   ">
                                                selected
                                            </Tag>}
                                            <div className=" min-[640px]:items-start min-[640px]:flex cursor-pointer " onClick={() => { selectCard(detail.id, detail.title) }}>
                                                {/* <img src={determine_card(detail.card_type)} width="36" height="24" alt="cardType" /> */}
                                                <div className="block mt-3 min-[640px]:mt-0 min-[640px]:ml-4 ">
                                                    {/* <h2 class="text-xs  text-gray-800">Bank Name:</h2> */}
                                                    <div className=" text-lg font-medium text-[rgb(17,24,39)]  ">{detail.title}</div>
                                                    {/* <label class="text-xs text-gray-600">Account Holder's Name:</label> */}
                                                    <p className="text-sm text-gray-800">{detail.action}</p>
                                                    {/* <label class="text-xs text-gray-600">Account Number</label> */}
                                                    <div className="min-[640px]:items-center min-[640px]:flex mt-1 text-sm text-[rgb(75,85,99)]  "><div>{detail.value}</div><span className="min-[640px]:inline min-[640px]:mx-2 hidden ">.</span> <div>Account added on:{detail.created_at}</div> </div>
                                                </div>

                                            </div>
                                            <div className=" mt-4 min-[640px]:mt-0 min-[640px]:flex-shrink-0 min-[640px]:ml-6 ">
                                                <Popconfirm
                                                    title="Remove Payment Card"
                                                    description={`Sure you want to Remove ${detail.title} ?`}
                                                    onConfirm={(e) => { confirm(e, detail.title, detail.id) }}
                                                    onCancel={cancel}
                                                    okText="Delete"
                                                    cancelText="Cancel"
                                                >
                                                    <button className="m-0 cursor-pointer inline-flex items-center rounded-md bg-[rgb(255,255,255)] px-3 py-2 text-sm font-semibold text-[rgb(17,24,39)] border   ">
                                                        Remove Account
                                                    </button>
                                                </Popconfirm>

                                            </div>
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
