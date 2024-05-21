import React, { useState, useEffect } from "react";
import ATMCardForm from "./AtmCardForm";
import { useStateContext } from "../../ContextProvider/ContextProvider";
import axios from '../../Axios'
import verve from '../../assets/Verve-Logo.png';
import visa from '../../assets/Visa-Payment-Card.png';
import masterCard from '../../assets/mastercard.png';
import { message, Popconfirm, Tag } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { styles } from '../ChatBot/Style'



export default function Payments() {
  const [isChangePassword, setIsChangePassword] = useState(false);
  const { user } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState([
    // {
    //   title: "MasterCard ****4567",
    //   value: "Expiration: 02/24",
    //   action: "Remove Payment Method",
    //   link: "",
    //   id: "",
    //   card: true,
    //   card_type: "Visa",
    //   created_at:"",
    // },
    // {
    //   title: "MasterCard ****4567",
    //   value: "Expiration: 02/24",
    //   action: "Remove Payment Method",
    //   link: "",
    //   id: "",
    //   card: true,
    //   card_type: "Verve",
    //   created_at:"",
    // },
  ]);


  const detailsArray = [
    // {
    //   title: "Refund Account details",
    //   value: "Add Bank Details for Refund",
    //   action: "Add",
    //   link: "/edit-name",
    // },  
    // ...accountDetails,
    {
      title: "Payment Cards",
      value: "Add New Payment Method",
      action: "Add",
      link: "/edit-name",
    },
    ...paymentDetails

  ];


  message.config({
    duration: 3,
  });

  //Confirm deleting the Card 
  const confirm = async (e, type, cardId) => {
    // console.log(e);

    await axios.delete(`/deleteUserCard/${cardId}/${user.id}`).then(response => {
      console.log(response);
      message.success(`Card ${type} Removed successfully`);
      fetchUserCards();
    }).catch(error => {
      console.error("Failed to Remove Card", error);
      message.error(`An Error Occured while trying to Remove Card ${type}`)
    })

  };
  const cancel = (e) => {
    console.log();
  };

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



  useEffect(() => {

    if (user.id) {
      fetchUserCards();
    }
  }, [user.id]);
  // Fetch user cards
  const fetchUserCards = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/getUserCards/${user.id}`);
      console.log('cards', response.data);

      const newDetails = response.data.data.map((card) => {
        const formattedCreatedAt = new Date(card.created_at).toLocaleString();
        return {
          title: `${card.cardtype} ****${card.card_number.slice(-4)}`,
          value: `Expiration: ${card.expiry_data.slice(0, 2)}/${card.expiry_data.slice(2)}`,
          action: "Remove Payment Method",
          link: "",
          id: card.id,
          card: true,
          card_type: card.cardtype,
          created_at: formattedCreatedAt,
          selected: card.Selected,
        };
      });
      setPaymentDetails(newDetails);



    } catch (error) {
      console.error('Error fetching user cards:', error);
    } finally {
      setLoading(false)
    }
  };


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



  return (
    <div>
      {loading?
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
            top: 'calc(50% - -42px)',
            left: 'calc(50% - 41px)',


          }


        }}
      />
      </>
        :
      <div className="max-w-2xl mx-auto ">
        <div>

          <div className="tab">

            {isChangePassword && (
              <div className="max-w-2xl mx-auto p-4">
                <h2 className="text-2xl font-medium mb-4">Payment Card</h2>
                <ATMCardForm userId={user.id} close={(bool) => { setIsChangePassword(bool) }} refresh={() => { fetchUserCards() }} />
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
                      <>
                        <button
                          className="underline"
                          onClick={() => { setIsChangePassword(true);  }}
                        >
                          {detail.action}
                        </button>
                      </>

                    </div>
                  </>
                  :
                  <div className=" min-[640px]:justify-between min-[640px]:items-start min-[640px]:flex py-5 px-6 bg-[rgb(249,250,251)] rounded-md w-full relative" >
                    <h4 className=" absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap ">{detail.card_type}</h4>
                    {(detail.selected == "Selected") && <Tag bordered={true} color="success" className=" min-[640px]:text-[10px] max-[639px]:right-2 min-[640px]:left-3 min-[640px]:bottom-1 absolute min-[640px]:leading-4   ">
                      selected
                    </Tag>}
                    <div className=" min-[640px]:items-start min-[640px]:flex cursor-pointer " onClick={() => { selectCard(detail.id, detail.title) }}>
                      <img src={determine_card(detail.card_type)} width="36" height="24" alt="cardType" />
                      <div className="block mt-3 min-[640px]:mt-0 min-[640px]:ml-4 ">
                        <div className=" text-sm font-medium text-[rgb(17,24,39)] ">{detail.title}</div>
                        <div className="min-[640px]:items-center min-[640px]:flex mt-1 text-sm text-[rgb(75,85,99)]  "><div>{detail.value}</div><span className="min-[640px]:inline min-[640px]:mx-2 hidden ">.</span> <div>Card added on:{detail.created_at}</div> </div>
                      </div>

                    </div>
                    <div className=" mt-4 min-[640px]:mt-0 min-[640px]:flex-shrink-0 min-[640px]:ml-6 ">
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
