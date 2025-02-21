import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import Peer from 'peerjs'; // Import PeerJS
import CallModal from './CallModal'; // Import your CallModal component
import dynamoUserInformationService from "../../aws/dynamoUserInformationService";
import { useSelector } from "react-redux";

const ChatHeader = ({ receiverProfilePicUrl, receiverName, receiverId, sendJsonMessage, lastJsonMessage, chatId }) => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [peer, setPeer] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [call, setCall] = useState(null);
  const remoteVideoRef = React.useRef(null);
  const userData = useSelector((state) => state.user.userData);

  const handleCloseCallModal = () => {
      setIsCallModalOpen(false);
      if (call) {
          call.close();
      }
      if (remoteStream) {
          remoteStream.getTracks().forEach(track => track.stop());
          setRemoteStream(null);
      }
  };

  const fetchPeerDetails = async (userId) => {
      try {
        // Check if an existing chat exists between the users
        const latestPeerDetails = await dynamoUserInformationService.getPeerDetailsByUserId(userId);
        if (latestPeerDetails) {
            return latestPeerDetails;
        } else {
            console.log(`No peer ID found for user ${userId}`);
        }
      } catch (error) {
        console.error("Failed to fetch PeerId.", error);
      }
  };
    
  const sendPeerIdMessageToReceiverHeader = async () => {
    const receiverPeerDetails = await fetchPeerDetails(receiverId);
    const callerPeerDetails = await fetchPeerDetails(userData.userId);
    
    sendJsonMessage(
      { 
        action: 'sendCall', 
        data: {
          chatId, 
          receiver: {
            receiverId: receiverId,
            peerId: receiverPeerDetails.peerId, 
            connectionId: receiverPeerDetails.connectionId
          },
          caller: {
            callerId: userData.userId,
            peerId: callerPeerDetails.peerId,
            connectionId: callerPeerDetails.connectionId
          }
        } 
      });
  }

  return (
      <div className="p-1 flex items-center justify-between rounded-2xl shadow-2xl" style={{ background: 'linear-gradient(145deg, #2c3e50, #1f3347)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 -4px 8px rgba(0, 0, 0, 0.2), 4px 0 8px rgba(0, 0, 0, 0.2), -4px 0 8px rgba(0, 0, 0, 0.2)' }}>
          <div className="flex-shrink-0">
              <img
                  src={receiverProfilePicUrl || "https://avatar.iran.liara.run/public/boy?username=Ash"}
                  alt={`${receiverName}'s profile`}
                  className="w-12 h-12 rounded-full object-cover"
              />
          </div>
          <Link to={`/PoeticOdyssey/profile/${receiverId}`} className="ml-4 text-white font-semibold text-lg">
              {receiverName}
          </Link>
          <div className="flex space-x-4">
              <button aria-label="Call" className="text-white hover:text-gray-300" onClick={() => sendPeerIdMessageToReceiverHeader()}>
                  <FontAwesomeIcon icon={faVideo} />
              </button>
              {/* <button aria-label="Video Call" className="text-white hover:text-gray-300" onClick={() => startCall(true)}>
                  <FontAwesomeIcon icon={faVideo} />
              </button> */}
          </div>

          {/* Call Modal */}
          {isCallModalOpen && (
              <CallModal
                  onClose={handleCloseCallModal}
                  remoteVideoRef={remoteVideoRef}
                  isVideoCall={isVideoCall}
              />
          )}
          {isCallModalOpen && <video ref={remoteVideoRef} autoPlay style={{ width: '300px', height: '300px' }} />}
      </div>
  );
};

export default ChatHeader;
