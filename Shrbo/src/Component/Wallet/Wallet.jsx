import React, { useState, useEffect } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { TiArrowForwardOutline } from "react-icons/ti";
import { FaRegCreditCard } from "react-icons/fa";
import verve from '../../assets/Verve-Logo.png';
import visa from '../../assets/Visa-Payment-Card.png';
import masterCard from '../../assets/mastercard.png';
import { useStateContext } from "../../ContextProvider/ContextProvider";
import { message, notification, Tag, Popconfirm } from 'antd';
import { Link } from "react-router-dom";
import Header from "../Navigation/Header";
import Footer from "../Navigation/Footer";
import { FaPlusCircle } from "react-icons/fa";
import axios from "../../Axios";
import { LuArrowDownLeft, LuArrowUpRight, LuArrowUpWideNarrow, LuFileClock } from "react-icons/lu";
import Popup from "../../hoc/Popup";
import WithdrawForm from "./WithdrawForm";








const Wallet = () => {


    const [transactions, setTransactions] = useState([

        // {
        //     id: "1",
        //     imageUrl: url,
        //     status: "Incoming",
        //     from: "Shbro",
        //     amount: "1,000"

        // },


        // {
        //     id: "2",
        //     imageUrl: url,
        //     status: "Outgoing",
        //     from: "Shbro",
        //     amount: "3,000"

        // },
        // {
        //     id: "3",
        //     imageUrl: url,
        //     status: "Incoming",
        //     from: "Shbro",
        //     amount: "500"

        // },
        // {
        //     id: "4",
        //     imageUrl: url,
        //     status: "Outgoing",
        //     from: "Shbro",
        //     amount: "4,000"

        // },


    ]);
    const [loadingCards, setLoadingCards] = useState(true);
    const [requestLoading, setRequestLoading] = useState(false);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [loadingRequest, setLoadingRequest] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);

    const [paymentDetails, setPaymentDetails] = useState([
        // {
        //     title: "MasterCard ****4567",
        //     value: "Expiration: 02/24",
        //     selected: "",
        //     //   action: "Remove Payment Method",
        //     link: "",
        //     id: "1",
        //     card_type: "Visa",
        //     created_at: "",
        // },
        // {
        //     title: "MasterCard ****4567",
        //     value: "Expiration: 02/24",
        //     //   action: "Remove Payment Method",
        //     link: "",
        //     id: "2",
        //     selected: "Selected",
        //     card_type: "Verve",
        //     created_at: "2",
        // },

    ]);
    const [isViewBalance, setViewBalance] = useState(true);
    const [balance, setBalance] = useState("");
    const [acLoading, setAcLoading] = useState(false);
    const [supportedBanks, setSupportedBanks] = useState([]);
    const [paymentRequest, setPaymentRequests] = useState([]);


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


    useEffect(() => {
        setLoadingCards(true);
        setLoadingBalance(true);
        setLoadingRequest(true);
        setLoadingTransactions(true);
        if (user.id) {
            fetchUserCards();
            fetchWalletBalance()
            fetchWalletWithdrawRequsts();
            fetchWalletTransactions();
        }
    }, [user]);

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



    const toggleSelected = (cardId) => {
        setPaymentDetails((prevPaymentDetails) =>
            prevPaymentDetails.map((paymentDetail) => {
                // Check if the current paymentDetail has the same id as the parameter


                if (paymentDetail.id === cardId) {
                    // Toggle the selected field
                    return { ...paymentDetail, selected: paymentDetail.selected === 'Selected' ? null : 'Selected' };
                } else if (paymentDetail.selected !== null) {
                    // Deselect any previously selected item
                    return { ...paymentDetail, selected: null };
                }
                // Keep other paymentDetails unchanged
                return paymentDetail;
            })
        );

    }

    const selectCard = async (cardId, type) => {

        toggleSelected(cardId);

        await axios.get(`/selectCard/${cardId}/${user.id}`).then(response => {
            console.log(response);
            message.success(`Card ${type} Selected successfully`);
        }).catch(err => {
            console.error("Failed to Selected Card", err);
            message.error(`An Error Occured while trying to Select Card ${type}`)
            toggleSelected(cardId);

        })

    }

    const determine_card = (type) => {
        let cardUrl = "";
        if (type == "Visa") {
            cardUrl = visa;
        } else if (type == "Verve") {
            cardUrl = verve;
        } else if (type == "Master") {
            cardUrl = masterCard;
        }

        return (cardUrl);

    }



    const Transactions = transactions.map((transaction) => (

        <li key={transaction.id} className="flex justify-between gap-x-6 py-5 md:py-4">
            <div className="flex min-w-0 gap-x-4 items-center">
                {/* <img className=" h-12 w-12   md:h-10 md:w-10  flex-none rounded-full bg-gray-50" src={transaction.imageUrl} alt="" /> */}


                {transaction.status == "Incoming" ? <LuArrowDownLeft /> : <LuArrowUpRight />}

                <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{transaction.for}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{transaction.status == "Incoming" ? "From" : "To"}: {transaction.from},{transaction.for} {transaction.time}</p>
                </div>
            </div>
            <div className=" shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className={` text-base font-normal leading-6 ${transaction.status == "Incoming" ? "text-green-500" : "text-gray-900 "} `}>{transaction.status == "Incoming" ? "+" : "-"} {transaction.amount}</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                    ₦{transaction.amount}
                </p>

            </div>
        </li>

    ));

    const Cards = paymentDetails.map((detail) => (
        <li key={detail.id} className=" min-[640px]:justify-between min-[640px]:items-start min-[640px]:flex py-3   rounded-md w-full relative" >
            <h4 className=" absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap ">{detail.card_type}</h4>
            {(detail.selected == "Selected") && <Tag bordered={true} color="success" className=" min-[640px]:text-[10px] max-[639px]:right-2 min-[640px]:left-16 min-[640px]:bottom-1 absolute min-[640px]:leading-4   ">
                selected
            </Tag>}
            <div className=" items-center min-[640px]:flex cursor-pointer " onClick={() => { selectCard(detail.id, detail.title) }}>
                <div className=" bg-slate-400/30 rounded  h-8 w-12  px-2 " >
                    <img src={determine_card(detail.card_type)} className="h-full object-contain w-full " alt="cardType" />
                </div>
                <div className="block mt-3 min-[640px]:mt-0 min-[640px]:ml-4 ">
                    <div className=" text-xs font-medium text-[rgb(17,24,39)] ">{detail.title}</div>
                    {/* <div className="min-[640px]:items-center min-[640px]:flex mt-1 text-sm text-[rgb(75,85,99)]  "><div>{detail.value}</div><span className="min-[640px]:inline min-[640px]:mx-2 hidden ">.</span> <div>Card added on:{detail.created_at}</div> </div> */}
                </div>

            </div>
            {/* <div className=" mt-4 min-[640px]:mt-0 min-[640px]:flex-shrink-0 min-[640px]:ml-6 ">
                <Popconfirm
                    title="Remove Payment Card"
                    description={`Sure you want to remove ${detail.title} Card?`}
                    onConfirm={(e) => { confirm(e, detail.title, detail.id) }}
                    onCancel={cancel}
                    okText="Delete"
                    cancelText="Cancel"
                >
                    <button className="m-0 cursor-pointer inline-flex items-center rounded-md bg-[rgb(255,255,255)] px-3 py-2 text-sm font-semibold text-[rgb(17,24,39)] border   ">
                        Remove Card
                    </button>
                </Popconfirm>

            </div> */}


        </li>
    ));





    // Fetch user cards
    const fetchUserCards = async () => {
        setLoadingCards(true);
        try {
            const response = await axios.get(`/getUserCards/${user.id}`);
            console.log('cards', response.data);

            const newDetails = response.data.data.slice(0, 3).map((card) => {
                const formattedCreatedAt = new Date(card.created_at).toLocaleString();
                return {
                    title: `${card.cardtype} ****${card.card_number.slice(-4)}`,
                    value: `Expiration: ${card.expiry_data.slice(0, 2)}/${card.expiry_data.slice(2)}`,
                    link: "",
                    id: card.id,
                    card_type: card.cardtype,
                    created_at: formattedCreatedAt,
                    selected: card.Selected,
                };
            });
            setPaymentDetails(newDetails);



        } catch (error) {
            console.error('Error fetching user cards:', error);
        } finally {
            setLoadingCards(false)
        }
    };

    //Fetch Wallet Balance
    const fetchWalletBalance = async () => {
        setLoadingBalance(true);

        try {
            const response = await axios.get(`/viewUserWallet`);

            console.log('balance', response.data);

            const balance = response.data.total_balance;

            setBalance(balance);

        } catch (error) {

        } finally {
            setLoadingBalance(false);
        }

    };

    function formatDate(inputDate) {
        const date = new Date(inputDate); // Parse the input date string
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if necessary
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (zero-based) and pad with leading zero if necessary
        const year = date.getFullYear(); // Get full year
        const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero if necessary
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero if necessary

        // Return formatted date string in "DD/MM/YYYY HH:mm" format
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    // Example usage:
    //   const inputDate = "2024-04-24T14:22:50.000000Z";
    //   const formattedDate = formatDate(inputDate);
    //   console.log(formattedDate); // Output: "24/04/2024 14:22"


    //fetch Wallet Transactions
    const fetchWalletTransactions = async () => {

        try {
            const response = await axios.get(`/viewUserWalletRecords`);

            // Extracting and formatting data
            const formattedTransactions = Object.entries(response.data.wallet_records).slice(0, 5).flatMap(([title, walletRecord]) => {
                return walletRecord.records.map(record => ({
                    id: record.id,
                    status: "Incoming", // Assuming status is always "Incoming" for this format
                    from: `Shbro,${walletRecord.title}`,
                    for: record.hosthome_title, // Determine "for" value based on the presence of hosthome
                    amount: record.amount,
                    time: formatDate(record.created_at)
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
    const fetchWalletWithdrawRequsts = async () => {

        try {
            const response = await axios.get(`/getUserPaymentRecords`);

            const formattedTransactions = response.data.payment_records.slice(0, 3).map((data) => ({
                id: data.id,

                user_id: data.user_id,
                account_number: data.account_number,
                account_name: data.account_name,
                amount: formatAmountWithCommas(data.amount),
                bank_name: data.bank_name,
                approvedStatus: data.approvedStatus,
                created_at: data.created_at,



            }));

            setPaymentRequests(formattedTransactions);

        } catch (error) {

        } finally {

            setLoadingRequest(false);
        }


    }


    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, error) => {
        api[type]({
            message: type === "error" ? 'Error' : "Succesfull",
            description: error,
            placement: 'topRight',
            className: 'bg-green'
        });
    };

    //Request pay
    const requestPayment = async (data) => {
        setRequestLoading(true);

        const details = {
            account_number: data.accountNumber,
            bank_name: data.bankName,
            account_name: data.fullName,
            amount: data.withdrawAmount
        }


        try {
            const response = await axios.post(`/requestPay`, details);
            setWithdrawModalOpen(false);
            openNotificationWithIcon("success", "Your withdraw request has been sent Successfully");
        } catch (error) {
            setWithdrawModalOpen(false)
            if (error.response.data.message) {
                openNotificationWithIcon("error", error.response.data.message);
                setError(error.response.data.message);

            } else {

                openNotificationWithIcon("error", error.response.data);
                setError(error.response.data);
            }
        } finally {

            setRequestLoading(false);
        }


    }


    const cardSkeletonLoader = Array.from({ length: 3 }).map((group, index) =>
        <div
            key={index}
            className=" relative  h-fit row-span-1  flex items-center gap-4   w-full  md:mt-2 "
        >
            <div
                className="  h-6 skeleton-loader rounded cursor-pointer p-4  flex hover:bg-slate-100/10  w-12  "
            />
            <div
                className="  h-1 skeleton-loader cursor-pointer p-2  flex hover:bg-slate-100/10 w-32  "
            />



        </div>

    );




    const requestSkeletonLoader = Array.from({ length: 3 }).map((group, index) =>
        <div
            key={index}
            className=" relative  h-fit row-span-1  items-center gap-2   w-full  md:mt-2 "
        >
            <div
                className=" justify-between   flex hover:bg-slate-100/10  w-full  "
            >
                <div className=" skeleton-loader h-5 w-6 "></div>
                <div className=" skeleton-loader h-5 w-14 "></div>



            </div>
            <div
                className="  h-5 skeleton-loader cursor-pointer p-2  flex hover:bg-slate-100/10 w-full "
            />



        </div>

    );


    const transactionSkeletonLoader = Array.from({ length: 5 }).map((group, index) =>
        <div
            key={index}
            className=" relative  h-fit row-span-1  items-center gap-2   w-full  md:mt-2 "
        >
            <div
                className=" justify-between   flex hover:bg-slate-100/10  w-full  "
            >
                <div className=" skeleton-loader h-3 w-6 "></div>
                <div className=" skeleton-loader h-3 w-14 "></div>



            </div>
            <div
                className="  h-3 skeleton-loader cursor-pointer p-2  flex hover:bg-slate-100/10 w-full "
            />



        </div>

    );




    message.config({
        duration: 5,
    });



    //Confirm cancelling Request
    const confirm = async (e, id) => {
        // console.log(e);

        await axios.get(`/cancelPayRequest/${id}`).then(response => {
            console.log(response);
            message.success(`Cancelled request`);
            fetchWalletWithdrawRequsts();
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




    function formatAmountWithCommas(amount) {
        // Convert the amount to a string and split it into integer and decimal parts
        const [integerPart, decimalPart] = amount.toString().split('.');

        // Add commas to the integer part
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Combine the integer and decimal parts with a dot if there is a decimal part
        const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

        return formattedAmount;
    }




    // viewUserWalletRecords


    const WithdrawRequest = (
        <div className=" h-full   example ">
            {!loadingRequest ?
                <ul role="list" className="divide-y divide-gray-100  ">
                    {paymentRequest.length > 0 ?
                        <>
                            {paymentRequest.map((payment) => (
                                <li key={payment.id} className="flex justify-between gap-x-6 py-5">
                                    <div className="flex min-w-0 gap-x-4">
                                        {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="" alt="" /> */}
                                        <div className="min-w-0 flex-auto">
                                            <p className="text-sm font-semibold leading-6 text-gray-900"> ₦{payment.amount}</p>
                                            <p className="mt-1 w-[22vw] truncate text-xs leading-5 text-gray-500">To: acct {payment.account_number},{payment.bank_name},{payment.account_name}</p>
                                        </div>
                                    </div>
                                    <div className=" shrink-0 sm:flex sm:flex-col sm:items-end">
                                        <p className={`text-sm leading-6 ${payment.approvedStatus ? "text-gray-900 " : "text-red-500"}`}>{payment.approvedStatus ?? "pending"}</p>
                                        <div className="mt-1 flex items-center gap-x-1.5">
                                            {/* <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div> */}
                                            {!payment.approvedStatus && <Popconfirm
                                                title="Cancel Request"
                                                description={`Sure you want to cancel this payout request ?`}
                                                onConfirm={(e) => { confirm(e, payment.id) }}
                                                onCancel={cancel}
                                                okText="Yes"
                                                cancelText="Cancel"
                                            >
                                                <button className="text-xs border rounded-md p-[4px] font-semibold hover:bg-slate-50 transition-colors   leading-5 text-gray-500">Cancel</button>

                                            </Popconfirm>}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </>
                        :
                        <div className=" m-11 mt-20 text-sm ">
                            You have not added a co-host yet.
                        </div>

                    }
                </ul>
                :
                <div className=" w-full h-full ml-1 flex flex-col gap-2  ">
                    {requestSkeletonLoader}
                </div>
            }
        </div>
    )











    return (
        <div className="min-h-[100vh]   bg-slate-50">
            <Header />
            {contextHolder}

            <div className=" max-w-5xl mx-auto h-full  ">

                <div className=" md:my-14 py-6 md:px-6 h-full   md:flex  gap-4">

                    <div className="h-[90vh] overflow-y-scroll example mx-4 md:w-[60%] col-span-[1.5] md:mx-0 md:h-[600px]  p-4 bg-white shadow-sm  rounded-2xl mt-2 ">
                        <div className={` flex flex-wrap mt-3 md:mt-0 w-full h-44 rounded-2xl shadow-md transition-colors  px-8 py-6 ${loadingBalance ? " bg-white" : "bg-gradient-to-r from-orange-300/70 via-orange-500/50 to-orange-700/25"} `}>
                            <div className=" h-full w-full text-slate-700 ">
                                <div className=" text-sm text-slate-700 font-medium mb-5 flex items-center gap-3">
                                    {!loadingBalance ? <p className="m-0">Wallet Balance</p> : <div className="skeleton-loader h-4 mt-2 w-32 " />}

                                    {!loadingBalance && <>{
                                        isViewBalance ?
                                            <button onClick={() => { setViewBalance(false) }}><VscEyeClosed className="h-5 w-5" /></button>
                                            :
                                            <button onClick={() => { setViewBalance(true) }}><VscEye className="h-5 w-5" /></button>

                                    }</>}
                                </div>
                                <div className="  flex flex-wrap justify-between " >
                                    {!loadingBalance ? <div className=" text-4xl font-semibold text-slate-700   ">{isViewBalance ? `₦${balance ? formatAmountWithCommas(balance) : "00.00"}` : "**********"} </div>
                                        :
                                        <div className=" skeleton-loader h-8 mt-2 w-56  " />
                                    }
                                    <div className=" flex gap-3 " >
                                        {/* <div className=" h-full flex items-center flex-col gap-1 ">
                                            <button className=" rounded-full h-10 bg-slate-100 p-3"><TiArrowBackOutline /></button>
                                            <label className=" text-[11px] leading-4 font-medium ">Send</label>
                                        </div> */}

                                        <div className={` h-full  items-center flex-col gap-1 ${loadingBalance ? "hidden" : "flex"}   `}>
                                            <button onClick={() => { setWithdrawModalOpen(true) }} className=" rounded-full h-10 bg-slate-100 p-3"><TiArrowForwardOutline /></button>
                                            <label className=" text-[11px] leading-4 font-medium ">Request</label>
                                        </div>
                                        <Popup isModalVisible={isWithdrawModalOpen} title={"Withdraw To"} handleCancel={() => { !requestLoading && setWithdrawModalOpen(false) }} >
                                            {requestLoading ? <div className=' w-full h-96 flex items-center justify-center'>
                                                <div className="containerld"></div>

                                            </div>
                                                :
                                                <WithdrawForm close={(bool) => { setWithdrawModalOpen(false) }} loading={acLoading} Submit={(val) => { requestPayment(val) }} banks={supportedBanks} />}
                                        </Popup>


                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className=" mt-6 mx-1 h-full  ">

                            <div className={` w-full pb-4 md:hidden   gap-8  ${loadingTransactions ? "hidden" : "flex"} `}>
                                <div className=" flex flex-col justify-center items-center ">

                                    <Link to={"/ManageCard"} className=" rounded-full w-10 p-2 shadow-sm bg-white "> <FaRegCreditCard className=" w-5 h-5  text-orange-500" /></Link>
                                    <label className=" text-xs ">Linked cards</label>
                                </div>
                                <div className=" flex flex-col justify-center items-center ">

                                    <Link to={"/WalletRecords/RequestHistory"} className=" rounded-full w-10 p-2 shadow-sm bg-white "> <LuFileClock className=" w-5 h-5 font-bold text-orange-500" />
                                        {/* <LuArrowUpWideNarrow className=" w-5 h-5 font-bold text-orange-500" /> */}
                                    </Link>
                                    <label className=" text-xs ">Request history</label>
                                </div>
                            </div>


                            <div className=" flex justify-between ">
                                <p className=" font-medium text-lg ">Last Transactions</p>
                                {!loadingTransactions && <Link to={"/WalletRecords/WalletHistory"} className=" text-orange-500 text-sm font-medium" >View All</Link>}
                            </div>

                            {!loadingTransactions ?

                                <ul role="list" className="divide-y divide-gray-100 h-full overflow-y-scroll example mt-4">


                                    {transactions.length > 0 ?
                                        <>
                                            {Transactions}

                                        </>

                                        :
                                        <li className=" text-black w-full text-center flex mt-28  justify-center h-full ">No Transaction History</li>
                                    }


                                </ul>
                                :
                                <div className=" flex flex-col gap-3 "  >{transactionSkeletonLoader}</div>}


                        </div>




                    </div>

                    <div className="md:grid grid-rows-2 md:w-[40%] md:h-[600px] gap-4 mt-2 hidden ">

                        <div className=" w-full  overflow-y-scroll example   p-6 h-full  bg-white rounded-2xl">

                            <div className="  flex justify-between ">
                                <p className=" font-medium text-lg ">Withdraw Requests</p>
                                {paymentDetails.length > 0 && <Link to={"/WalletRecords/RequestHistory"} className=" text-orange-500 text-sm font-medium" >View All</Link>}
                            </div>
                            {WithdrawRequest}

                        </div>

                        <div className=" p-6 h-full bg-white rounded-2xl ">

                            <div className=" h-full overflow-y-scroll example ">
                                <div className="  flex justify-between ">
                                    <p className=" font-medium text-lg ">Linked Cards</p>
                                    {paymentDetails.length > 0 && <Link to={"/ManageCard"} className=" text-orange-500 text-sm font-medium" >View All</Link>}
                                </div>

                                <ul role="list" className=" h-full overflow-y-scroll example mt-4">

                                    {!loadingCards ?
                                        <>
                                            {Cards}

                                            <li className=" mt-2">
                                                {/* <h4 className=" absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap ">{detail.card_type}</h4> */}

                                                <div className=" items-center flex  cursor-pointer " >
                                                    <Link to={"/ManageCard"} >

                                                        <div className=" border border-dotted border-black/80 flex justify-center items-center  rounded  h-8 w-12  p-1 " >

                                                            <FaPlusCircle className=" w-4 h-4" />

                                                        </div>
                                                    </Link>
                                                    <div className="block mt-3 min-[640px]:mt-0 min-[640px]:ml-4 ">
                                                        <div className=" text-xs font-medium  text-orange-400 ">Add new card</div>
                                                    </div>

                                                </div>
                                            </li>
                                        </>
                                        :
                                        <>
                                            {cardSkeletonLoader}
                                        </>
                                    }

                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            <div className="md:block hidden mt-[13vh] ">

                <Footer />
            </div>
        </div>

    );

}


export default Wallet;