import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Axios from "../../Axios";
import { notification } from "antd";

const ReportListing = ({ id,onSubmit }) => {
  const [goNext, setGoNext] = useState(false);
  const [reportCategory, setReportCategory] = useState(0);
  const [reportType, setReportType] = useState();
  const [loading, setLoading] = useState(false);
  const [extraReason, setExtraReason] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);


  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setReportType(e.target.value);
  };
  const onCategoryChange = (e) => {
    console.log("radio checked", e.target.value);
    setReportCategory(e.target.value);
  };

  const handleNext = (e) => {
    e.preventDefault();
    setGoNext(true);
    if (ReportCategories.length === 0) {
      setLoading(true);
    }
  };
  const handleBack = () => {
    setGoNext(false);
  };

  const handleExtraReasonChange = (e) => {
    setExtraReason(e.target.value);
  };

  const handleReport = (e) => {
    e.preventDefault();
  
    if (!reportType) {
      notification.error({
        message: "Error",
        description: "Please select a report type.",
      });
      return;
    }
  
    if (goNext && reportCategory === 0) {
      notification.error({
        message: "Error",
        description: "Please select a reason for reporting.",
      });
      return;
    }
  
    setLoadingSubmit(true); // Disable the "Submit" button
    const requestBody = {
      title: ReportTypes.find((report) => report.index === reportType).report,
      reasonforreporting: ReportCategories.find(
        (report) => report.index === reportType
      ).category[reportCategory],
      host_home_id: id,
      extrareasonforreporting: extraReason,
    };
  
    Axios.post("/reporthosthome", requestBody)
      .then((response) => {
        console.log("Report submitted successfully");
        notification.success({
          message: "Success",
          description: "Report submitted successfully!",
        });
        // Call the onSubmit callback
      })
      .catch((error) => {
        console.error("Error while submitting report:", error);
        notification.error({
          message: "Error",
          description: "Failed to submit report. Please try again later.",
        });
      })
      .finally(() => {
        setLoadingSubmit(false); // Re-enable the "Submit" button
      });
  };
  
  
  

  // Your existing code for rendering the component goes here

  const ReportTypes = [
    { index: 1, report: "Inaccurate", type: "This listing Is inaccurate" },
    { index: 2, report: "Offensive", type: "This listing Is offensive" },
    { index: 3, report: "Fraudulent", type: "This listing Is fraudlent" },
  ];

  const ReportCategories = [
    {
      index: 1,
      report: "Inaccurate",
      category: [
        "The photos misrepresent the property",
        "The listing details are incorrrect",
        "The Listing is missing essential infromation",
      ],
    },
    {
      index: 2,
      report: "Offensive",
      category: [
        "The photos ",
        "The listing details",
        "Reviews of the property",
        "Communication with the host",
      ],
    },
    {
      index: 3,
      report: "Fraudulent",
      category: [
        "The property doesn't exist ",
        "The host is requesting direct payment outside of Shrbo",
        "The Listing includes the host's personal infromation",
        "The host is not authorized to rent the property",
      ],
    },
  ];

  return (
    <div className="w-full flex flex-col gap-3 md:gap-6 ">
      {!goNext && (
        <p className=" mt-4  text-2xl   font-medium ">
          Why are you reporting this listing?
        </p>
      )}

      <form>
        <div
          style={{
            height: loading ? "400px" : "0px",
            width: "100%",
            textAlign: "center",
            backgroundColor: "white",
          }}
        >
          <LoadingOutlined
            className="transition-3"
            style={{
              ...{
                position: "absolute",
                fontWeight: "600",
                color: "rgb(250, 152, 72)",
                zIndex: loading ? "10" : "-1",
                display: loading ? "block" : "none",
                opacity: loading ? "1" : "0",
                fontSize: "82px",
                top: "calc(50% - 41px)",
                left: "calc(50% - 41px)",
              },
            }}
          />
        </div>

        {!goNext ? (
          <div className=" flex items-stretch justify-start flex-wrap w-full  md:h-full overflow-hidden mb-4  ">
            <Radio.Group
              buttonStyle={"solid"}
              onChange={onChange}
              value={reportType}
            >
              {ReportTypes.map((report) => (
                <div
                  key={report.index}
                  className=" relative px-[6px] mb-5  w-full  md:px-[7px]  "
                >
                  <Radio value={report.index}>
                    <span className=" text-base  font-normal whitespace-nowrap   ">
                      {report.type}
                    </span>
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        ) : (
          <div className=" w-full transition-3   ">
            {ReportCategories.map((report) => (
              <div
                className={` ${
                  report.index === reportType ? "block" : "hidden"
                } transition-3`}
                key={report.index}
              >
                <div className=" flex flex-col gap-6">
                  <div className=" text-2xl mt-4   font-medium  ">
                    The listing is {report.report} because?
                  </div>
                  <div className=" text-base  ">
                    Make sure you do not include any personal information in
                    your feedback. We may contact you if we have any questions.
                  </div>
                  <div className=" flex flex-col">
                    <Radio.Group
                      buttonStyle={"solid"}
                      onChange={onCategoryChange}
                      size="medium"
                    >
                      {report.category.map((cat, index) => (
                        <div
                          key={index}
                          className=" relative px-[6px] mb-5  w-full break-words text-gray-700  md:px-2 "
                        >
                          <Radio className="    " value={index}>
                            <span className="  text-base font-normal w-full   ">
                              {cat}
                            </span>
                          </Radio>
                        </div>
                      ))}
                    </Radio.Group>
                  </div>
                  <div className="">
                    <div className="mt-2.5">
                      <textarea
                        name="extraReason"
                        id="extraReason"
                        rows={4}
                        placeholder={`(optional) give us more details on why you think the listing is ${report.report} `}
                        className="block w-full rounded-md ring-0 outline-gray-400 border px-3.5 py-2 text-gray-900 shadow-sm focus:outline-gray-400 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        value={extraReason}
                        onChange={handleExtraReasonChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className=" my-3 flex flex-row justify-between transition-3  ">
          <button
            type="button"
            onClick={handleBack}
            disabled={!goNext ? true : false}
            className={`rounded-md transition-3 text-orange-400 ring-1 font-medium ring-orange-400 p-2 px-3 opacity-100 disabled:cursor-not-allowed disabled:hover:bg-white hover:bg-slate-50`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={reportType ? false : true}
            className={`rounded-md text-white  ${
              goNext ? "hidden" : "block"
            } disabled:hover:bg-orange-300 hover:bg-orange-500   bg-orange-300 p-2 font-medium  px-4 ${
              reportType && "bg-orange-400"
            }`}
          >
            Next
          </button>
          <button
  onClick={(e) => handleReport(e)}
  disabled={reportType ? false : true || loadingSubmit}
  className={`rounded-md text-white ${
    !goNext ? "hidden" : "block"
  } hover:bg-orange-500  bg-orange-300 p-2 font-medium  px-4 ${
    reportType && "bg-orange-400"
  }`}
>
  {loadingSubmit ? "Submitting..." : "Submit"}
</button>
        </div>
      </form>
    </div>
  );
};

export default ReportListing;
