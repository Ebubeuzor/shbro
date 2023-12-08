import React, { Component, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Tabs } from "antd";

import multiMonthPlugin from "@fullcalendar/multimonth";
import { IoIosArrowForward } from "react-icons/io";
import HostHeader from "../Navigation/HostHeader";
import HostBottomNavigation from "./HostBottomNavigation";
import { Modal, Select, Input } from "antd";
import DiscountCustomModal from "./DiscountCustomModal";
import CalenderAvailability from "./CalenderAvailability";
import PricingModal from "./PricingModal";

export default class Scheduler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockingMode: false,
      blockedDates: [],
      selectedHouse: null,
      selectedDate: null,
      selectedDatePrice: "",
      selectedEditDate: null,
      isEditingPrice: false,
      editedPrice: "",
      selectedDates: [],
      discountModalVisible: false,
      isApartmentSelected: false,

      showWeeklyDiscountDetails: false,
      apartmentPrices: {
        "Lekki Admiralty": {
          basePrice: "₦400002",
          weekendDiscount: "10%",
          weeklyDiscount: "15%",
          // Add other details for Lekki Admiralty
        },
        "Lekki Phase 1": {
          basePrice: "₦500000",
          weekendDiscount: "15%",
          weeklyDiscount: "20%",
          // Add other details for Lekki Phase 1
        },
        "Lekki Units square": {
          basePrice: "₦400005",
          weekendDiscount: "12%",
          weeklyDiscount: "18%",
          // Add other details for Lekki Units square
        },
        // Add other apartments and their details here
      },
    };
  }

  handleToggleWeeklyDetails = () => {
    this.setState((prevState) => ({
      showWeeklyDiscountDetails: !prevState.showWeeklyDiscountDetails,
    }));
  };

  handleDateClick = (dateInfo) => {
    const { blockedDates, blockingMode, selectedDates } = this.state;
    const clickedDate = dateInfo.dateStr;

    if (blockingMode) {
      const updatedBlockedDates = blockedDates.includes(clickedDate)
        ? blockedDates.filter((date) => date !== clickedDate)
        : [...blockedDates, clickedDate];

      this.setState({ blockedDates: updatedBlockedDates });
    } else {
      if (blockedDates.includes(clickedDate)) {
        const updatedBlockedDates = blockedDates.filter(
          (date) => date !== clickedDate
        );
        this.setState({ blockedDates: updatedBlockedDates });
      }
    }

    if (!blockingMode) {
      const { selectedDates } = this.state;

      // Check if the clicked date is in the selectedDates array
      if (selectedDates.includes(clickedDate)) {
        // If the date is already selected, remove it
        const updatedSelectedDates = selectedDates.filter(
          (date) => date !== clickedDate
        );
        this.setState({ selectedDates: updatedSelectedDates });
      } else {
        // If the date is not selected, add it
        this.setState({
          selectedDates: [...selectedDates, clickedDate],
          selectedEditDate: dateInfo.dateStr,
          selectedDatePrice: "",
          showWeeklyDiscountDetails: true, // Show discount details when a date is clicked
        });
      }
    }
  };

  handlePriceChange = (event) => {
    const newPrice = event.target.value;
    this.setState({ selectedDatePrice: newPrice });
  };

  handleEditPrice = () => {
    this.setState({ isEditingPrice: true });
  };

  handleSavePrice = (event) => {
    event.preventDefault();

    const { selectedEditDate, selectedDatePrice } = this.state;

    if (selectedEditDate) {
      Modal.confirm({
        title: "Save Changes",
        content: "Are you sure you want to save the changes?",
        onOk: () => {
          // User confirmed, proceed with saving the changes
          console.log("Date:", selectedEditDate);
          console.log("Price:", selectedDatePrice);
        },
        onCancel: () => {
          // User canceled, do nothing or handle it as needed
        },
      });
    } else {
      // If a date is not selected, show the "Please select a date" modal
      Modal.confirm({
        title: "Error",
        content: "Please select a date before saving the price.",
        onOk: () => {
          // User confirmed, you can choose to handle it as needed
        },
        okButtonProps: { className: "orange-button" },
      });
    }
  };

  handleBlockMode = () => {
    this.setState({ blockingMode: true });
  };

  handleUnblockMode = () => {
    this.setState({ blockingMode: false });
  };

  handleHouseSelect = (house) => {
    this.setState({ selectedHouse: house });
  };

  dateHasBackground = (date) => {
    return this.state.selectedDates.includes(date);
  };

  toggleBlockMode = () => {
    this.setState((prevState) => ({
      blockingMode: !prevState.blockingMode,
    }));
  };

  markPassedDatesAsBlocked(blockedDates) {
    const currentDate = new Date();
    return blockedDates.map((date) => ({
      title: new Date(date) < currentDate ? 'Blocked' : 'Unblocked',
      start: date,
      allDay: true,
    }));
  }

  render() {
    const {
      blockingMode,
      blockedDates,
      selectedHouse,
      selectedDate,
      selectedDatePrice,
      isEditingPrice,
      editedPrice,
      discountModalVisible, // Include this state variable

      showWeeklyDiscountDetails,
    } = this.state;
    const items = [
      {
        key: "1",
        label: (
          <div className="text-neutral-600 text-xl rounded-t-lg">Pricing</div>
        ),
        children: (
          <Pricing
            selectedHouse={selectedHouse}
            isEditingPrice={isEditingPrice}
            editedPrice={editedPrice}
            selectedDate={selectedDate}
            selectedDatePrice={selectedDatePrice}
            onEditPrice={this.handleEditPrice}
            onSavePrice={this.handleSavePrice}
            onPriceChange={this.handlePriceChange}
            blockingMode={blockingMode}
            handleToggleWeeklyDetails={this.handleToggleWeeklyDetails}
            showWeeklyDiscountDetails={showWeeklyDiscountDetails}
            // Pass the function as a prop
          />
        ),
      },
      {
        key: "2",
        label: (
          <div className="text-neutral-600 text-xl rounded-t-lg">
            Availability
          </div>
        ),
        children: (
          <div className="text-neutral-600 rounded-t-lg">
            {selectedHouse ? (
              <CalenderAvailability />
            ) : (
              <div>Select an apartment/house to view details</div>
            )}
          </div>
        ),
      },
    ];

    const apartments = [
      {
        name: "Lekki Admiralty",
        basePrice: "₦400002",
        customWeekendPrice: "Add",
        weeklyDiscount: "10%",
        weeklyAverage: "₦2000065",
        monthlyDiscount: "20%",
        monthlyAverage: "₦2000065",
        moreDiscounts: "Early bird, last-minute, trip length",
      },
      {
        name: "Lekki Phase 1",
        basePrice: "₦500000",
        customWeekendPrice: "Add",
        weeklyDiscount: "15%",
        weeklyAverage: "₦3000000",
        monthlyDiscount: "25%",
        monthlyAverage: "₦3000000",
        moreDiscounts: "Early bird, last-minute, trip length",
      },
      {
        name: "Lekki Units square",
        basePrice: "₦400005",
        customWeekendPrice: "Add",
        weeklyDiscount: "12%",
        weeklyAverage: "₦2000080",
        monthlyDiscount: "22%",
        monthlyAverage: "₦2000080",
        moreDiscounts: "Early bird, last-minute, trip length",
      },
    ];

    const houseOptions = apartments.map((apartment) => apartment.name);

    const currentDate = new Date();
    const pastYear = new Date();
    pastYear.setFullYear(currentDate.getFullYear() - 1);

    const validRange = {
      start: pastYear.toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
      // end: currentDate.toISOString().split('T')[0],
    };

    const backgroundEvents = blockedDates.map((date) => ({
      start: date,
      end: date,
      rendering: 'background',
      color: '#ff9f89', // Set the background color as needed
      display: 'inverse-background',
      extendedProps: {
        cost: 50,
      },
    }));

    const markedBlockedDates = this.markPassedDatesAsBlocked(blockedDates);

    return (
      <div>
        <HostHeader />
        <HostBottomNavigation />
        <div className="flex flex-wrap  box-border w-full">
          <div className="block flex-grow relative overflow-y-scroll example">
            <div className="flex flex-col relative py-8 px-6">
              <select
                name="houseSelect"
                id="houseSelect"
                onChange={(e) => this.handleHouseSelect(e.target.value)}
                className="py-5 border pr-4 border-orange-400 mb-4 pl-4"
              >
                <option value="">Select an Apartment</option>
                {houseOptions.map((house, index) => (
                  <option key={index} value={house}>
                    {house}
                  </option>
                ))}
              </select>
              {selectedHouse && (
                <div className="mb-4">
                  <button
                    className={`${
                      blockingMode ? "bg-orange-400" : "bg-black"
                    } text-white py-2 px-4 rounded`}
                    onClick={this.toggleBlockMode}
                  >
                    {blockingMode ? "Unblock date" : "Block date"}
                  </button>
                </div>
              )}
              {selectedHouse && (
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin, multiMonthPlugin]}
                  initialView="dayGridMonth"
                  // multiMonthMaxColumns={1}
                 
                  // editable
                  validRange={validRange}
                  selectable
                  dateClick={this.handleDateClick}
                  events={[
                    ...blockedDates.map((date) => ({
                      // title: "Blocked",
                      start: date,
                      allDay: true,
                      display: 'background',
                      backgroundColor:"rgba(0, 0, 0, 0.1)"
                    })),
                    // ...markedBlockedDates,
                    ...this.getUnblockedDates(),
                  ]}
                  eventContent={(arg) => {
                    const dateStr = arg.event.start.toISOString().split("T")[0];
                    const price =
                      this.state.apartmentPrices[this.state.selectedHouse];

                    return {
                      html: `
                      <div>
                        <div>${arg.event.title}</div>
                        <div> ${price.basePrice}</div>
                      </div>
                    `,
                      backgroundColor: this.dateHasBackground(arg.event.start)
                        ? "orange"
                        : "white",
                    };
                  }}
                />
              )}
              {selectedDate && blockingMode && (
                <div className="mt-4 border">
                  <label className="font-semibold text-lg">
                    Price for {selectedDate}
                  </label>
                  {isEditingPrice ? ( // Check the editing mode
                    <div>
                      <input
                        type="number"
                        value={editedPrice}
                        onChange={this.handlePriceChange}
                        placeholder="Enter price per night"
                      />
                      <button onClick={this.handleSavePrice}>Save</button>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium">{selectedDatePrice}</div>
                      <button onClick={this.handleEditPrice}>Edit</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="bg-slate-100 h-2 p-2 w-full md:hidden"></div>
          <section className=" w-[370px] border-l z-[1] min-[1128px]:block">
            <div className=" block box-border overflow-auto h-screen relative bg-white">
              <div className="block box-border py-8 px-6">
                <Tabs defaultActiveKey="1" items={items} />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  getUnblockedDates() {
    const { blockedDates } = this.state;
    const today = new Date();
    const unblockedDates = [];

    for (let i = 0; i < 365; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() + i);
      const currentDateString = currentDate.toISOString().split("T")[0];

      if (!blockedDates.includes(currentDateString)) {
        unblockedDates.push({
          title: "Available",
          start: currentDateString,
          allDay: true,
        });
      }
    }

    return unblockedDates;
  }
}

// ...

const Pricing = ({
  selectedHouse,
  isEditingPrice,
  editedPrice,
  onEditPrice,
  onSavePrice,
  onPriceChange,
  selectedDate,
  blockingMode,
  selectedDatePrice,
  showWeeklyDiscountDetails,
  handleToggleWeeklyDetails,
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
  const [discountDuration, setDiscountDuration] = useState(""); // Store the selected discount duration
  const [discountPercentage, setDiscountPercentage] = useState(""); // Store the discount percentage
  const [weeklyDiscount, setWeeklyDiscount] = useState(""); // Store the weekly discount
  const [monthlyDiscount, setMonthlyDiscount] = useState("");

  const selectedApartment = apartments[selectedHouse];

  const clearInputValue = () => {
    onPriceChange({ target: { value: "" } });
  };

  const showDiscountModal = () => {
    setCustomModalVisible(true); // Set the custom modal to be visible
  };

  const showPricingModal = () => {
    setPricingModalVisible(true); // Set the custom modal to be visible
  };

  const hidePricingModal = () => {
    setPricingModalVisible(false); // Set the custom modal to be visible
  };

  const hideDiscountModal = () => {
    setDiscountModalVisible(false);
  };

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
    setCustomModalVisible(false);
  };

  const saveDiscountSettings = (discount) => {
    // Handle saving the discount (e.g., updating state or making API requests)
    // Here, `discount` contains the calculated discount (e.g., "10%")
  };

  return (
    <div className="block box-border  overflow-y-scroll example pb-32">
      {selectedApartment ? (
        <div className="block box-border my-5 min-[1128px]:mb-4">
          <div className="box-border flex justify-between items-baseline mb-6">
            <span>
              <h2 className="m-0 p-0 text-2xl block box-border">
                <div className="min-[1128px]:text-lg font-semibold capitalize">
                  {selectedHouse}
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
             <div className="pointer p-4 rounded-2xl border">
             
                <div>
                  <div className="font-medium mb-2 mr-1 text-sm">Per night</div>
                  <div className="h-auto visible w-full">
                  <button onClick={showPricingModal}>
                    <div className="text-3xl break-keep inline-block font-extrabold">
                      <div className="block">{selectedApartment.basePrice}</div>
                      {editedPrice}
                    </div>
                       </button>
                    {/* ... other code ... */}
                  </div>
                </div>
           
              </div>

              <div className="pointer p-4 rounded-2xl border">
               
                <div>
                  <div className="font-medium mb-2 mr-1 text-sm">Custom weekend Price</div>
                  <div className="h-auto visible w-full">
                  <button onClick={showPricingModal}>
                    <div className="text-3xl break-keep inline-block font-extrabold">
                      <div className="block">{selectedApartment.basePrice}</div>
                      {editedPrice}
                    </div>
                    </button>
                    {/* ... other code ... */}
                  </div>
                </div>
              
              </div>
             </div>

              <br />
              <h1 className="my-2 font-bold text-2xl">Discount</h1>

              <div className="space-y-3">
                <div
                  className="pointer p-4 rounded-2xl border"
                  onClick={showDiscountModal}
                >
                  <div>
                    <div className="font-medium mb-2 mr-1 text-sm">Weekly</div>
                    <p className="text-gray-400">For 7 nights or more</p>
                    <div className="h-auto visible w-full">
                      <div className="text-3xl break-keep inline-block font-extrabold">
                        0%
                      </div>
                      {isEditingPrice ? (
                        <div>{/* ... other code ... */}</div>
                      ) : (
                        <div>
                          <div className="text-gray-400">
                            Weekend Average:{" "}
                            <span className="font-medium">₦900000</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="pointer p-6 rounded-2xl border"
                  onClick={showDiscountModal}
                >
                  <div>
                    <div className="font-medium mb-2 mr-1 text-sm">Monthly</div>
                    <p className="text-gray-400">For 28 nights or more</p>
                    <div className="h-auto visible w-full">
                      <div className="text-3xl break-keep inline-block font-extrabold">
                        0%
                      </div>
                      {isEditingPrice ? (
                        <div>{/* ... other code ... */}</div>
                      ) : (
                        <div>
                          <div className="text-gray-400">
                            Monthly Average:{" "}
                            <span className="font-medium">₦9000000</span>
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
            />
            <PricingModal
            visible={pricingModalVisible}
            onClose={hidePricingModal}
            />
          </div>
        </div>
      ) : (
        <div>Select an apartment/house to view details</div>
      )}
    </div>
  );
};

