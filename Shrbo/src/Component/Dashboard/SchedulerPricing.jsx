import React, { useState, useEffect } from "react";
import PricingModal from "./PricingModal";
import DiscountCustomModal from "./DiscountCustomModal";
import axios from "../../Axios";
import { message } from 'antd';

const Pricing = ({
  selectedHouse,
  isEditingPrice,
  editedPrice,
  setEditedPrice,
  onEditPrice,
  onSavePrice,
  onPriceChange,
  blockingMode,
  selectedDatePrice,
  showWeeklyDiscountDetails,
  handleToggleWeeklyDetails,
  fetch,
  isHouseLoading,
}) => {
  // Define the apartment data
  const apartments = {
    "Lekki Admiralty": {
      basePrice: "₦42",
      customWeekendPrice: "Add",
      weeklyDiscount: "10%",
      weeklyAverage: "₦265000",
      monthlyDiscount: "20%",
      monthlyAverage: "₦265000",
      moreDiscounts: "Early bird, last-minute, trip length",
    },
    "Lekki Phase 1": {
      basePrice: "₦50000",
      customWeekendPrice: "Add",
      weeklyDiscount: "15%",
      weeklyAverage: "₦300000",
      monthlyDiscount: "25%",
      monthlyAverage: "₦300000",
      moreDiscounts: "Early bird, last-minute, trip length",
    },
    "Lekki Units square": {
      basePrice: "₦40005",
      customWeekendPrice: "Add",
      weeklyDiscount: "12%",
      weeklyAverage: "₦200080",
      monthlyDiscount: "22%",
      monthlyAverage: "₦200080",
      moreDiscounts: "Early bird, last-minute, trip length",
    },
  };

  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [pricingModalVisible, setPricingModalVisible] = useState(false);
  const [customWeeklyDiscount, setCustomWeeklyDiscount] = useState(""); // Store the weekly discount
  const [customMonthlyDiscount, setCustomMonthlyDiscount] = useState("");
  const [type, setType] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  const [price, setPrice] = useState(""); // price sent to the price modal
  const [percentage, setPercentage] = useState(""); // percentage sent to the discount modal
  const [loading, setLoading] = useState(false);
  

  const selectedApartment = selectedHouse;

  const clearInputValue = () => {
    onPriceChange({ target: { value: "" } });
  };

  const showDiscountModal = (type, percent) => {
    setDiscountType(type);
    setPercentage(percent);
    setCustomModalVisible(true); // Set the custom modal to be visible
  };

  const showPricingModal = (type) => {
    setPricingModalVisible(true); // Set the custom modal to be visible
    setType(type);


    if (type === "Custom Weekend Price") {
      setPrice(weekendPrice?selectedApartment.customWeekendPrice:selectedApartment.basePrice);


    } else if (type === "Per night") {
      setPrice(selectedApartment.basePrice)

    }



  };

  const hidePricingModal = () => {
    if (loading) {
      return;
    }
    setPricingModalVisible(false); // Set the custom modal to be visible
  };

  // const hideDiscountModal = () => {
  //   setDiscountModalVisible(false);
  // };

  const isWeeklyDiscountApplicable = () => {
    // Calculate the number of selected nights
    const numberOfNights = 7;
    return numberOfNights >= 7; // Display the discount if the duration is 7 nights or more
  };

  const [isCustomModalVisible, setCustomModalVisible] = useState(false);

  // ... other code

  const showCustomModal = () => {
    setCustomModalVisible(true);
  };

  const hideCustomModal = () => {
    if (loading) {
      return;
    }
    setPercentage("");
    setCustomModalVisible(false);
  };

  const saveDiscountSettings = async (discountType, discountPercentage) => {

    const id = selectedApartment.id;
    const data = {
      duration: discountType,
      discount_percentage: discountPercentage,
    }
    setLoading(true);
    await axios.post(`/schdulerEditHostHomediscount/${id}`, data).then(response => {
      fetch(id).finally(() => {
        message.success("Updated Discount")
        setLoading(false);
        hideCustomModal()

      });
    }).catch(err => {
      hideCustomModal()
      setLoading(false);
      message.error("Couldn't Update Discount")

    })


  };




  const extractPercentage = (discountString) => {
    const lowercasedDiscount = discountString.toLowerCase();


    const percentageMatch = lowercasedDiscount.match(/(\d+)%/);
    return percentageMatch ? percentageMatch[1] : null;


  };

  const savePrice = async (price, date) => {

    setLoading(true);

    const id = selectedApartment.id;


    if (type === "Custom Weekend Price") {
      // setWeekendPrice(price);
      await axios.put(`/schduler/host-homes/${id}/edit-weekend-price`, { price }).then(

        fetch(id).finally(() => {
          setLoading(false);
          message.success("Updated Weekend Price")
          hidePricingModal();

        })

      ).catch(err => {
        setLoading(false);
        message.error("Couldn't Update Weekend Price")
        console.log(err)
        // setWeekendPrice(selectedApartment.customWeekendPrice != null ? selectedApartment.customWeekendPrice : selectedApartment.basePrice)
        setLoading(false);
        hidePricingModal();
      }).finally(() => {
      });

    } else if (type === "Per night") {
      // setBasePrice(price);
      // setEditedPrice(price) /// for The calender price to change
      await axios.post(`/schduler/host-homes/${id}/edit-price`, { price, dates: "" }).then(response => {

        fetch(id).finally(() => {
          setLoading(false);
          message.success("Updated Base Price")
          hidePricingModal();

        });

      }).catch(err => {
        setLoading(false);
        message.error("Couldn't Update Base Price")
        console.log(err)
        // setBasePrice(selectedApartment.basePrice)
        // setEditedPrice(selectedApartment.basePrice)  /// for The calender price to change
        hidePricingModal();

      }).finally(() => {
      });


    }


  }

  useEffect(() => {

    if (selectedHouse) {

      setBasePrice(selectedHouse.basePrice);

      setWeekendPrice(selectedHouse.customWeekendPrice != null ? selectedHouse.customWeekendPrice : selectedHouse.basePrice);

      setCustomWeeklyDiscount(selectedHouse.customWeeklyDiscount?.discount_percentage);
      console.log(selectedHouse.customWeeklyDiscount?.discount_percentage)

      setCustomMonthlyDiscount(selectedHouse.customMonthlyDiscount?.discount_percentage)


    }

  }, [selectedHouse]);

  const formatAmountWithCommas = (amount) => {
    // Convert the amount to a string and split it into integer and decimal parts
    const [integerPart, decimalPart] = amount.toString().split('.');

    // Add commas to the integer part
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine the integer and decimal parts with a dot if there is a decimal part
    const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

    return formattedAmount;
  }

  const calculateMonthlyAverage = (percent, dailyPrize, weekendBonusMultiplier) => {

    console.log("percent", percent);
    console.log("daily", parseInt(dailyPrize.replace(/,/g, '')));
    console.log("weekendPrice", weekendBonusMultiplier.replace(/,/g, ''));

    const daysInMonth = 30;

    // Calculate the total prize for the month without considering weekends
    const totalPrizeWithoutWeekends = parseInt(dailyPrize.replace(/,/g, '')) * daysInMonth;

    // Calculate the total prize for weekends if weekendBonusMultiplier is not empty
    let totalPrizeWeekends = 0;
    let totalPrize=0
    if (weekendBonusMultiplier.trim() !== '') {
        const weekends = Math.floor(daysInMonth / 7) * 2; // Assuming there are two weekends in a month
        totalPrizeWeekends = weekends * parseInt(weekendBonusMultiplier.replace(/,/g, ''));
        const weekdays=daysInMonth-weekends;
        totalPrize=(weekdays*parseInt(dailyPrize.replace(/,/g, '')) )+totalPrizeWeekends;

    }

    // Calculate the total prize for the month including weekends
    const totalPrizeWithWeekends = totalPrize!=0?totalPrize :totalPrizeWithoutWeekends;

    // Calculate the monthly average
    const average = totalPrizeWithWeekends * (parseInt(percent) / 100);
    const total=totalPrizeWithWeekends-average;

    return formatAmountWithCommas(total);
}



const calculateWeeklyAverage = (percent, dailyPrize, weekendBonusMultiplier) => {

  console.log("percent", percent);
  console.log("daily", parseInt(dailyPrize.replace(/,/g, '')));
  console.log("weekendPrice", weekendBonusMultiplier.replace(/,/g, ''));

  

  // Calculate the total prize for the month without considering weekends
  const totalPrizeWithoutWeekends = parseInt(dailyPrize.replace(/,/g, '')) * 7;

  // Calculate the total prize for weekends if weekendBonusMultiplier is not empty
  let totalPrizeWeekends = 0;
  let totalPrize=0
  if (weekendBonusMultiplier.trim() !== '') {
      const weekends = 2; // Assuming there are two weekends in a month
      totalPrizeWeekends = weekends * parseInt(weekendBonusMultiplier.replace(/,/g, ''));
      const weekdays=7-weekends;
      totalPrize=(weekdays*parseInt(dailyPrize.replace(/,/g, '')) )+totalPrizeWeekends;

  }

  // Calculate the total prize for the month including weekends
  const totalPrizeWithWeekends = totalPrize!=0?totalPrize :totalPrizeWithoutWeekends;

  // Calculate the monthly average
  const average = totalPrizeWithWeekends * (parseInt(percent) / 100);
  const total=totalPrizeWithWeekends-average;

  return formatAmountWithCommas(total);
}




















  return (
    <div className="block box-border  pb-32">
    {!isHouseLoading?  <>
      {selectedApartment ? (
        <div className="block box-border my-5 min-[1128px]:mb-4">
          <div className="box-border flex justify-between items-baseline mb-6">
            <span>
              <h2 className="m-0 p-0 text-2xl block box-border">
                <div className="min-[1128px]:text-lg font-semibold capitalize overflow-ellipsis whitespace-nowrap overflow-hidden w-[70vw] md:w-[16vw]">
                  {selectedApartment.name}
                </div>
              </h2>
            </span>

            <div className="block box-border uppercase font-semibold text-xs pr-[10px]">
              <button className="bg-transparent cursor-pointer m-0 p-0 rounded-md underline">
                NGR
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 relative">
            <h1 className="my-2 font-bold text-2xl">Base Price</h1>

            <div className="cursor-pointer w-full h-full outline-none">
              <div className="space-y-4">
                <button className="w-full text-left " onClick={() => { showPricingModal("Per night") }}>
                  <div className="pointer p-4 rounded-2xl border">

                    <div>
                      <div className="font-medium mb-2 mr-1 text-sm">Per night</div>
                      <div className="h-auto visible w-full">
                        <div className="text-3xl break-keep inline-block font-extrabold">
                          <div className="block">₦{formatAmountWithCommas(basePrice)}</div>
                          {/* {editedPrice} */}
                        </div>
                        {/* ... other code ... */}
                      </div>
                    </div>

                  </div>
                </button>

                <button className="w-full text-left " onClick={() => { showPricingModal("Custom Weekend Price") }}>
                  <div className="pointer p-4 rounded-2xl border">

                    <div>
                      <div className="font-medium mb-2 mr-1 text-sm">Custom Weekend Price</div>
                      <div className="h-auto visible w-full">
                        <div className="text-3xl break-keep inline-block font-extrabold">
                          <div className="block">₦{weekendPrice ? formatAmountWithCommas(weekendPrice) : formatAmountWithCommas(basePrice)}</div>
                          {/* {editedPrice} */}
                        </div>
                        {/* ... other code ... */}
                      </div>
                    </div>

                  </div>
                </button>
              </div>

              <br />
              <h1 className="mt-2 font-bold text-2xl">Discount</h1>
              <p className="mb-2 font-light">Add a discount based on the duration of stay </p>
              <div className="space-y-3">
                <div
                  className="pointer p-4 rounded-2xl border"
                  onClick={() => {
                    showDiscountModal("Weekly", selectedApartment.weeklyDiscount
                      ? extractPercentage(selectedApartment.weeklyDiscount.discount) :
                      (selectedApartment.customWeeklyDiscount ?
                        customWeeklyDiscount : '0'))
                  }}
                >
                  <div>
                    <div className="font-medium mb-2 mr-1 text-sm">Weekly</div>
                    <p className="text-gray-400">For 7 nights or more</p>
                    <div className="h-auto visible w-full">
                      <div className="text-3xl break-keep inline-block font-extrabold">
                        {selectedApartment.weeklyDiscount ? ` ${extractPercentage(selectedApartment.weeklyDiscount.discount)}%` : (selectedApartment.customWeeklyDiscount ? `${customWeeklyDiscount}%` : '0%')}
                      </div>
                      {isEditingPrice ? (
                        <div>{/* ... other code ... */}</div>
                      ) : (
                        <div>
                          <div className="text-gray-400">
                            Weekend Average:{" "}
                            <span className="font-medium">₦{selectedApartment&&calculateWeeklyAverage( selectedApartment.weeklyDiscount
                      ? extractPercentage(selectedApartment.weeklyDiscount.discount) :
                      (selectedApartment.customWeeklyDiscount ?
                        customWeeklyDiscount : '0'),basePrice,weekendPrice)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="pointer p-6 rounded-2xl border"
                  onClick={() => {
                    showDiscountModal("Monthly",
                      selectedApartment.monthlyDiscount ?
                        extractPercentage(selectedApartment.monthlyDiscount.discount) :
                        (selectedApartment.customMonthlyDiscount ? customMonthlyDiscount : '0'))
                  }}
                >
                  <div>
                    <div className="font-medium mb-2 mr-1 text-sm">Monthly</div>
                    <p className="text-gray-400">For 30 nights or more</p>
                    <div className="h-auto visible w-full">
                      <div className="text-3xl break-keep inline-block font-extrabold">
                        {selectedApartment.monthlyDiscount ? `${extractPercentage(selectedApartment.monthlyDiscount.discount)}%` : (selectedApartment.customMonthlyDiscount ? `${customMonthlyDiscount}%` : '0%')}
                      </div>
                      {isEditingPrice ? (
                        <div>{/* ... other code ... */}</div>
                      ) : (
                        <div>
                          <div className="text-gray-400">
                            Monthly Average:{" "}
                            <span className="font-medium">₦{selectedApartment&&calculateMonthlyAverage(  selectedApartment.monthlyDiscount ?
                        extractPercentage(selectedApartment.monthlyDiscount.discount) :
                        (selectedApartment.customMonthlyDiscount ? customMonthlyDiscount : '0'),basePrice,weekendPrice)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DiscountCustomModal
              visible={isCustomModalVisible}
              onClose={hideCustomModal}
              onSubmit={saveDiscountSettings}
              discountType={discountType}
              percentage={percentage}
              loading={loading}
            />
            <PricingModal
              visible={pricingModalVisible}
              onClose={hidePricingModal}
              showBlocker={false}
              title={type}
              onSave={savePrice}
              price={price}
              loading={loading}
            />
          </div>
        </div>
      ) : (
        <div>Select an apartment/house to view details</div>
      )}
      </>
      :
      <>
        <div className=" w-full  flex gap-16 ">
          <div className=" skeleton-loader w-52 h-4 rounded " />
          <div className=" skeleton-loader w-11 h-4 rounded " />
        </div>
        <div>
          <div className=" skeleton-loader w-28 rounded h-6 mt-5 "></div>

          <div className=" skeleton-loader w-full rounded-xl h-24 mt-7 "></div>
          <div className=" skeleton-loader w-full rounded-xl h-24 mt-2 "></div>


          <div className=" skeleton-loader w-28 rounded h-6 mt-7 "></div>
          <div className=" skeleton-loader w-[85%] rounded h-4  "></div>

          <div className=" skeleton-loader w-full rounded-xl h-36 mt-2 "></div>
          <div className=" skeleton-loader w-full rounded-xl h-36 mt-2 "></div>

        </div>

      </>}

    </div>
  );
};

export default Pricing;
