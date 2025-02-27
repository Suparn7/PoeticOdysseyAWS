import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import Peer from 'peerjs'; // Import PeerJS
import CallModal from './CallModal'; // Import your CallModal component
import dynamoUserInformationService from "../../aws/dynamoUserInformationService";
import { useDispatch, useSelector } from "react-redux";
import awsChatService from "../../aws/awsChatService";
import { addMessage } from "../../store/chatSlice";

const ChatHeader = ({ receiverProfilePicUrl, receiverName, receiverId, sendJsonMessage, lastJsonMessage, chatId }) => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [peer, setPeer] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [call, setCall] = useState(null);
  const remoteVideoRef = React.useRef(null);
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
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
    
  const sendPeerIdMessageToReceiverHeader = async (isVideoCall) => {
    const receiverPeerDetails = await fetchPeerDetails(receiverId);
    const callerPeerDetails = await fetchPeerDetails(userData.userId);

    if(receiverPeerDetails === undefined){
        // Create a special message indicating a missed call
        const missedCallMessage = await awsChatService.sendMessage({
            chatId,
            senderId: userData.userId,
            receiverId,
            messageContent: `Missed ${isVideoCall ? 'video' : 'audio'} call from ${userData.name} at ${new Date().toLocaleTimeString()}`,
            messageType: "missedCall",
          });
        
        dispatch(addMessage(missedCallMessage));
        
        // Send the missed call message to the message list
        if(missedCallMessage) sendJsonMessage({ action: 'sendMessage', data: missedCallMessage });

        alert(`${receiverName} is not online. Please try again later.`);
        return; 
    }
    
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
          },
          isVideoCall: isVideoCall
        } 
      });
  }

  return (
    <div className="p-1 flex flex-col sm:flex-row items-center sm:justify-between rounded-2xl shadow-2xl" style={{ background: 'linear-gradient(145deg, #2c3e50, #1f3347)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 -4px 8px rgba(0, 0, 0, 0.2), 4px 0 8px rgba(0, 0, 0, 0.2), -4px 0 8px rgba(0, 0, 0, 0.2)' }}>
        <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row items-center space-x-4">
                <div className="flex-shrink-0">
                    <img
                        src={receiverProfilePicUrl || "https://avatar.iran.liara.run/public/boy?username=Ash"}
                        alt={`${receiverName}'s profile`}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                </div>
                <Link to={`/PoeticOdyssey/profile/${receiverId}`} className="text-white font-semibold text-sm text-center sm:text-left">
                    {receiverName}
                </Link>
            </div>
            <div className="flex flex-row space-x-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div aria-label="Video Call" className="text-white hover:text-gray-300 cursor-pointer p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg transform transition-transform duration-300 hover:scale-110" onClick={() => sendPeerIdMessageToReceiverHeader(true)}>
                <FontAwesomeIcon icon={faVideo} />
            </div>
            <div aria-label="Call" className="text-white hover:text-gray-300 cursor-pointer p-2 rounded-full bg-gradient-to-r from-green-500 to-teal-500 shadow-lg transform transition-transform duration-300 hover:scale-110" onClick={() => sendPeerIdMessageToReceiverHeader(false)}>
                <FontAwesomeIcon icon={faPhone} />
            </div>
            </div>
        </div>
    </div>
  );
};

export default ChatHeader;
