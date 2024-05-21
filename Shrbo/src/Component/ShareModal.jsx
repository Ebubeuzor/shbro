import React, { useState } from "react";
import Modal from "react-modal"; // Import the react-modal library
import { RiMailSendLine, RiMessage2Line, RiWhatsappLine, RiMessengerLine, RiTwitterXLine, RiFacebookCircleLine, RiClipboardFill, RiMailSendFill, RiMessage2Fill, RiWhatsappFill, RiMessengerFill, RiTwitterXFill, RiFacebookCircleFill } from "react-icons/ri"; // Import icons from react-icons library

const ShareModal = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleShare = (option) => {
    const url = window.location.href; // Get the current URL
    switch (option) {
      case "Copy Link":
        navigator.clipboard.writeText(url).then(() => {
            alert("URL copied to clipboard")
          console.log('URL copied to clipboard');
        }).catch(err => {
          console.error('Could not copy text: ', err);
        });
        break;
      case "Email":
        window.location.href = `mailto:?subject=Check out this experience&body=${url}`;
        break;
      case "Messages":
        // Implement sharing via messages
        window.location.href = `sms:?&body=${encodeURIComponent(url)}`;

        break;
      case "WhatsApp":
        window.open(`https://api.whatsapp.com/send?text=${url}`);
        break;
      case "Messenger":
        window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID`);
        break;
      case "Twitter":
        window.open(`https://twitter.com/intent/tweet?text=${url}`);
        break;
      case "Facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      default:
        break;
    }
    onClose();
  };
  

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={{ content: { width: "300px",height:"450px",zIndex:"99999",  margin: "auto", } }}>
      <h2 className="text-lg">Share this experience</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
      <li className="flex items-center gap-2 py-2 border-[1px] rounded-md  my-3 px-4" onClick={() => handleShare("Copy Link")}><RiClipboardFill /> Copy Link</li>
      <li className="flex items-center gap-2 py-2 border-[1px] rounded-md  my-3 px-4" onClick={() => handleShare("Email")}><RiMailSendFill /> Email</li>
      <li className="flex items-center gap-2 py-2 border-[1px] rounded-md  my-3 px-4" onClick={() => handleShare("Messages")}><RiMessage2Fill /> Messages</li>
      <li className="flex items-center gap-2 py-2 border-[1px] rounded-md  my-3 px-4" onClick={() => handleShare("WhatsApp")}><RiWhatsappFill /> WhatsApp</li>
      <li className="flex items-center gap-2 py-2 border-[1px] rounded-md  my-3 px-4" onClick={() => handleShare("Messenger")}><RiMessengerFill /> Messenger</li>
      <li className="flex items-center gap-2 py-2 border-[1px] rounded-md  my-3 px-4" onClick={() => handleShare("Twitter")}><RiTwitterXFill /> Twitter</li>
      <li className="flex items-center gap-2 py-2 border-[1px] rounded-md  my-3 px-4" onClick={() => handleShare("Facebook")}><RiFacebookCircleFill /> Facebook</li>
    </ul>
    </Modal>
  );
};

export default ShareModal;
