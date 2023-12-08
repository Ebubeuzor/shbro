import React, { useState } from "react";
import { Table, Modal, Button, Input, Select, Form } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";

const { Option } = Select;

const AdminSupportPage = () => {
  const [supportTickets, setSupportTickets] = useState([
    { id: 1, subject: "Issue 1", status: "Open", replies: [],rentalName:" 2b Admiralty way",disputeMessage: "this man no dey clean e house everywhere just dey smell",disputeEmail:"myemail@gmail.com"  },
    { id: 2, subject: "Issue 2", status: "Open", replies: [] ,rentalName:"Entire rental unit hosted by Goodie",disputeMessage:"omo i have complained to the host several times he refuses to give us clean towels",disputeEmail: "nameme@gmail.com"},
    // Add more support tickets data as needed
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [replyForm] = Form.useForm();

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Rental Name",
      dataIndex: "rentalName",
      key: "rentalName",
    },
    {
      title: "Dispute Message",
      dataIndex: "disputeMessage",
      key: "disputeMessage",
    },
    {
      title: "Dispute Email",
      dataIndex: "disputeEmail",
      key: "disputeEmail",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button onClick={() => showTicketModal(record)}>View Details</Button>
      ),
    },
  ];

  const showTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setTicketModalVisible(true);
  };

  const handleReplySubmit = () => {
    const { id } = selectedTicket;
    replyForm.validateFields().then((values) => {
      const updatedTickets = supportTickets.map((ticket) => {
        if (ticket.id === id) {
          return {
            ...ticket,
            replies: [...ticket.replies, values.reply],
          };
        }
        return ticket;
      });
      setSupportTickets(updatedTickets);
      replyForm.resetFields();
    });
  };

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400  text-white hidden md:block md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
        <h1 className="text-2xl font-semibold mb-4">Support Tickets</h1>
          <div className="mb-4">
          </div>
          <div className="overflow-x-auto">
            <Table columns={columns} dataSource={supportTickets} />
          </div>
          <Modal
            title="Support Ticket Details"
            open={ticketModalVisible}
            onCancel={() => setTicketModalVisible(false)}
            footer={null}
          >
            {selectedTicket && (
              <div>
                <p>Ticket ID: {selectedTicket.id}</p>
                <p>Subject: {selectedTicket.subject}</p>
                <p>Status: {selectedTicket.status}</p>
                <h3>Replies:</h3>
                <ul>
                  {selectedTicket.replies.map((reply, index) => (
                    <li key={index}>{reply}</li>
                  ))}
                </ul>
                <Form form={replyForm} layout="vertical">
                  <Form.Item
                    name="reply"
                    label="Reply"
                    rules={[
                      { required: true, message: "Please enter a reply" },
                    ]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                  <Button type="primary" onClick={handleReplySubmit}>
                    Add Reply
                  </Button>
                </Form>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;
