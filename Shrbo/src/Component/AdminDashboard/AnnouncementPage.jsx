import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { styles } from "../ChatBot/Style";
import Axois from "../../Axios"

const AnnouncementPage = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      // Make a request to the API endpoint
      await Axois.post("/sendEmail", {
        message: values.announcement,
        usertype: values.target,
      });

      let targetMessage = "";
      if (values.target === "Guest") {
        targetMessage = "Announcement sent successfully to guests";
      } else if (values.target === "Host") {
        targetMessage = "Announcement sent successfully to hosts";
      } else if (values.target === "All") {
        targetMessage = "Announcement sent successfully to all users";
      } else {
        targetMessage = "Please select a valid target audience";
      }

      message.success(targetMessage);

      // Reset form fields
      form.resetFields();
    } catch (error) {
      // Display error message
      message.error("Failed to send announcement");
    }
  };

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 overflow-scroll example text-white hidden md:block md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>
      

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">
            Send Announcement to All Users
          </h1>
          <div className="mb-4">
          <div className="text-sm text-gray-400">
          The Send Announcement to All Users feature allows you to send a mass message or announcement to all users on your platform. 
          </div>
        </div>
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              name="target"
              rules={[
                { required: true, message: "Please select the target audience" },
              ]}
            >
              <select className="p-2">
              <option value="Select">Select</option>

                <option value="Guest">Guest</option>
                <option value="Host">Host</option>
                <option value="All">All</option>
              </select>
            </Form.Item>
            <Form.Item
              name="announcement"
              rules={[
                { required: true, message: "Please enter your announcement" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send Announcement
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPage;
