import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { notification } from "antd";
import {useParams} from "react-router-dom"

import Axios from "../Axios"

const ReportForm = () => {
  const [goNext, setGoNext] = useState(false);
  const [reportCategory, setReportCategory] = useState(0);
  const [reportType, setReportType] = useState();
  const [loading, setLoading] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility


  const { id } = useParams();
  console.log(id);

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setReportType(e.target.value);
  };
  const onCategoryChange = (e) => {
    console.log("radio checked", e.target.value);
    setReportCategory(e.target.value);
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      const selectedReport = ReportTypes.find((cat) => cat.index === reportType);
      const formData = {
        reasonforreporting: selectedReport.type,
        hostorguestuser_id: id,
        extrareasonforreporting: additionalDetails,
      };
      console.log("Form Data:", formData);
      const response = await Axios.post("/reportUser", formData);
      console.log("Report submitted successfully:", response.data);
  
      setLoading(false);
      notification.success({
        message: "Report Submitted",
        description: "Your report has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      setLoading(false);
      notification.error({
        message: "Error",
        description: "Failed to submit the report. Please try again later.",
      });
    }
  };
  
  
  


  const handleBack = () => {
    setGoNext(false);
  };

  const ReportTypes = [
    {
      index: 1,
      report: "Inaccurate",
      type: "I think they're scamming or spamming me",
    },
    { index: 2, report: "Offensive", type: "They're being offensive" },
    { index: 3, report: "Fraudulent", type: "Something else" },
  ];

  return (
    <div className="w-full flex flex-col gap-3 md:gap-6 ">
      <p className=" mt-4  text-2xl   font-medium ">
        Why are you reporting this User?
      </p>

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

        <div className=" w-full transition-3   ">
          <div className=" flex flex-col gap-6">
            <div className=" flex flex-col">
              <Radio.Group
                buttonStyle={"solid"}
                onChange={onChange}
                size="medium"
                value={reportType}
              >
                {ReportTypes.map((cat, index) => (
                  <div
                    key={index}
                    className=" relative px-[6px] mb-5  w-full break-words text-gray-700  md:px-2 "
                  >
                    <Radio className="    " value={cat.index}>
                      <span className="  text-base font-normal w-full   ">
                        {cat.type}
                      </span>
                    </Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className="">
              <div className="mt-2.5">
              <textarea
                  name="message"
                  id="message"
                  rows={4}
                  placeholder="(optional) give us more details on why you think the listing is inaccurate "
                  className="block w-full rounded-md ring-0 outline-gray-400 border px-3.5 py-2 text-gray-900 shadow-sm focus:outline-gray-400 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className=" my-3 flex flex-row justify-between transition-3 w-full  ">
          <button
            type="button"
            onClick={handleNext}
            disabled={reportType ? false : true}
            className={`rounded-md w-full  text-white   disabled:hover:bg-orange-300 hover:bg-orange-500 text-base   bg-orange-300 p-2 font-medium  px-4 ${
              reportType && "bg-orange-400"
            }`}
          >
            Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
