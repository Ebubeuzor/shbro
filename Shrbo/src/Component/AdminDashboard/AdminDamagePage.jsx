import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Input, Form, message } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import Axios from "../../Axios";

const AdminDamagePage = () => {
  const [supportTickets, setSupportTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState({
    id: null,
    subject: "",
    status: "",
    replies: [],
    rentalName: "",
    disputeMessage: "",
    disputeEmail: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [replyForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const fetchReportedIssues = async () => {
    try {
      const response = await Axios.get("/getReportDamagesForAdmin");
      const data = response.data.data;
      console.log(data);
      setSupportTickets(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reported issues:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedIssues();
  }, []);

  const columns = [
    {
      title: "Guest Name",
      dataIndex: ["guest", "name"],
      key: "guestName",
    },
    {
      title: "Guest Email",
      dataIndex: ["guest", "email"],
      key: "guestEmail",
    },
    {
      title: "Guest Phone",
      dataIndex: ["guest", "phone_number"],
      key: "guestPhone",
    },
    {
      title: "Apartment Address",
      dataIndex: ["hosthome", "address"],
      key: "apartmentAddress",
    },
    {
      title: "Check-in Date",
      dataIndex: ["hosthome", "checkin"],
      key: "checkinDate",
    },
    {
      title: "Check-out Date",
      dataIndex: ["hosthome", "checkout"],
      key: "checkoutDate",
    },
    {
      title: "Apartment Description",
      dataIndex: ["hosthome", "description"],
      key: "apartmentDescription",
    },
    {
      title: "Damage Description",
      dataIndex: "damage_description",
      key: "damageDescription",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button onClick={() => showTicketModal(record)}>Show Details</Button>
      ),
    },
  ];

  const showTicketModal = (ticket) => {
    console.log("Ticket data:", ticket); // Debugging
    setSelectedTicket({
      id: ticket.id,
      subject: ticket.title,
      bookingNumber: ticket.booking_number, // Corrected property name

      status: ticket.status,
      replies: ticket.replies || [],
      rentalName: ticket.homeName,
      disputeMessage: ticket.reasonforreporting,
      disputeEmail: ticket.disputeEmail,
      hosthome: ticket.hosthome, // Ensure hosthome is properly set
      name: ticket.guest.name,
      email: ticket.guest.email,
      phone_number: ticket.guest.phone_number,
      reportDate: ticket.reportDate,
      damage_description: ticket.damage_description,
      video: ticket.video,
      images: ticket.images || [], // Add the images array
    });
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

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setVideoModalVisible(true);
  };

  const sendToHost = async (bookingNumber, id) => {
    try {
      console.log(bookingNumber, id);

      const response = await Axios.get(
        `/assignSecurityDepositToHost/${bookingNumber}/${id}`
      );
      message.success("Security Deposit  sent to Guest successfully"); // Show success message

      console.log("Response from sending to host:", response.data);
      setTicketModalVisible(false); // Close the modal

      // Update the UI or perform other actions based on the response
    } catch (error) {
      console.error("Error sending to host:", error);
    }
  };

  const sendToGuest = async (bookingNumber, id) => {
    try {
      console.log(bookingNumber, id);
      const response = await Axios.get(
        `/assignSecurityDepositToGuest/${bookingNumber}/${id}`
      );
      message.success("Security Deposit  sent to Guest successfully"); // Show success message

      console.log("Response from sending to guest:", response.data);
      setTicketModalVisible(false); // Close the modal

      // Update the UI or perform other actions based on the response
    } catch (error) {
      console.error("Error sending to guest:", error);
    }
  };

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 overflow-scroll example  text-white hidden md:block md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          
          <h1 className="text-2xl font-semibold mb-4">Damage Reports</h1>
          <div className="mb-4">
            <div className="text-gray-400 text-sm">
            The Damage Reports section is designed for hosts to report any damages to their apartments. 
            </div>
          </div>
          <div className="mb-4"></div>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={supportTickets}
              rowKey="id"
              loading={loading} // Show loader inside the table
            />
          </div>
          <Modal
            title="Damage Report Details"
            open={ticketModalVisible}
            onCancel={() => setTicketModalVisible(false)}
            footer={null}
          >
            {selectedTicket && (
              <div>
                <p>
                  <strong>ID:</strong> {selectedTicket.id}
                </p>
                <p>
                  <strong>Booking Number:</strong>{" "}
                  {selectedTicket.bookingNumber}
                </p>{" "}
                {/* Corrected here */}
                <p>
                  <strong>Name:</strong> {selectedTicket.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedTicket.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {selectedTicket.phone_number}
                </p>
                {selectedTicket.hosthome && (
                  <>
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedTicket.hosthome.address}
                    </p>
                    <p>
                      <strong>Check-in Date:</strong>{" "}
                      {selectedTicket.hosthome.checkin}
                    </p>
                    <p>
                      <strong>Check-out Date:</strong>{" "}
                      {selectedTicket.hosthome.checkout}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {selectedTicket.hosthome.description}
                    </p>
                    <div>
                      {selectedTicket.images &&
                        selectedTicket.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-4">
                            {selectedTicket.images &&
                              selectedTicket.images.length > 0 &&
                              selectedTicket.images.map((image) => (
                                <img
                                key={image.id}
                                src={image.images}
                                alt="Damage Image"
                                className="w-full h-auto cursor-pointer"
                                onClick={() => handleImageClick(image.images)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    handleImageClick(image.images);
                                  }
                                }}
                                tabIndex="0" // Make the element focusable
                              />
                              
                              ))}
                          </div>
                        )}
                    </div>

                    <p>
                      <strong>Video:</strong>{" "}
                      <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleVideoClick(selectedTicket.video)}
                      >
                        {selectedTicket.video}
                      </span>{" "}
                    </p>
                  </>
                )}
                <p>
                  <strong>Damage Description:</strong>{" "}
                  {selectedTicket.damage_description}
                </p>
                <p>
                  <strong>Report Date:</strong> {selectedTicket.reportDate}
                </p>
                <p>After reviewing the damage report, you can decide whether to send the security deposit to the host or the guest.</p>

                <Button
                  onClick={() =>
                    sendToHost(selectedTicket.bookingNumber, selectedTicket.id)
                  }
                >
                  Send to Host
                </Button>
                <Button
                  onClick={() =>
                    sendToGuest(
                      selectedTicket.bookingNumber,
                      selectedTicket.id
                    )
                  }
                >
                  Send to Guest
                </Button>
              </div>
            )}
          </Modal>
          <Modal
            title="Image"
            open={imageModalVisible}
            onCancel={() => setImageModalVisible(false)}
            footer={null}
          >
            {selectedImage && (
              <div>
                <img
                  src={selectedImage}
                  alt="Damage Image"
                  className="w-full h-auto"
                />
              </div>
            )}
          </Modal>
          <Modal
            title="Video"
            open={videoModalVisible}
            onCancel={() => setVideoModalVisible(false)}
            footer={null}
          >
            {selectedVideo && (
              <div>
                <video src={selectedVideo} controls className="w-full h-auto" />
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminDamagePage;
