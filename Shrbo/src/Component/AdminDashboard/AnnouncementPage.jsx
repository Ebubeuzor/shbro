import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { styles } from "../ChatBot/Style";

const AnnouncementPage = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    message.success("Announcement sent successfully to all users");
    form.resetFields();
  };

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 text-white hidden md:block md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">
            Send Announcement to All Users
          </h1>

          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              name="target"
              rules={[
                { required: true, message: "Please select the target audience" },
              ]}
            >
              <select className="p-2">
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
