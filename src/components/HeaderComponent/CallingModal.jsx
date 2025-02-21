import React, { useEffect, useState, useRef } from 'react';
import dynamoUserInformationService from '../../aws/dynamoUserInformationService';
import CallModal from '../CallComponents/CallModal';
import VideoContainer from '../CallComponents/VideoContainer';
import CallControls from '../CallComponents/CallControls';

const CallingModal = ({ peer, peersToCall, onClose, sendJsonMessage, lastJsonMessage, userID }) => {
    const [isCaller, setIsCaller] = useState(false);
    const [isCallAccepted, setIsCallAccepted] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const callRef = useRef(null);

    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing media devices.', error);
            }
        };

        getMediaStream();
    }, []);

    useEffect(() => {
        if (peersToCall && localStream) {
            const { receiverPeerId, callerPeerId } = peersToCall;
            if (peer.id === callerPeerId) {
                setIsCaller(true);
                const call = peer.call(receiverPeerId, localStream);
                callRef.current = call;
                call.on('stream', (remoteStream) => {
                    setRemoteStream(remoteStream);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                });
            }
        }
    }, [peersToCall, peer, localStream]);

    useEffect(() => {
        if (peersToCall) {
            const { receiverPeerId } = peersToCall;
            if (peer.id === receiverPeerId) {
                peer.on('call', (incomingCall) => {
                    callRef.current = incomingCall;
                });
            }
        }
    }, [peersToCall, peer]);

    useEffect(() => {
        if (lastJsonMessage !== null) {

            if (lastJsonMessage?.action === 'sendCallAccepted') {
                // Handle call accepted logic
                console.log('Call accepted:', lastJsonMessage.data);
                setIsCallAccepted(true);
                const getMediaStream = async () => {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                        setLocalStream(stream);
                        if (localVideoRef.current) {
                            localVideoRef.current.srcObject = stream;
                        }
                        console.log('Local stream set:', stream);
                    } catch (error) {
                        console.error('Error accessing media devices.', error);
                    }
                };
        
                getMediaStream();
            }

            if (lastJsonMessage?.action === 'sendCallEnded') {
                // Handle call ended logic
                const call = callRef.current;
                if (call) {
                    call.close();
                }
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                }
                if (remoteStream) {
                    remoteStream.getTracks().forEach(track => track.stop());
                }
                callRef.current = null;
                setLocalStream(null);
                setRemoteStream(null);
                onClose();
            }
        }
    }, [lastJsonMessage]);

    const handleAcceptCall = async () => {
        const call = callRef.current;
        const { callerUserId } = peersToCall;
        
        if (call && localStream) {
            call.answer(localStream);
            call.on('stream', (remoteStream) => {
                setRemoteStream(remoteStream);
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream;
                }
            });
            setIsCallAccepted(true);
            const callerPeerDetails = await dynamoUserInformationService.getPeerDetailsByUserId(callerUserId)

            sendJsonMessage(
                { 
                action: 'sendCallAccepted', 
                data: { 
                    callerConnetionId: callerPeerDetails.connectionId, 
                    isCallAccepted: true 
                } 
            });
        }
    };

    const handleEndCall = async () => {
        const call = callRef.current;
        if (call) {
            call.close();
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
        }
        callRef.current = null;
        setLocalStream(null);
        setRemoteStream(null);
        onClose();
    
        const { receiverUserId, callerUserId } = peersToCall;
        const toUpdateCallEndedUserId = isCaller ? receiverUserId : callerUserId;
        const targetUserDetails = await dynamoUserInformationService.getPeerDetailsByUserId(toUpdateCallEndedUserId)

    
        sendJsonMessage(
            { 
            action: 'sendCallEnded', 
            data: { 
                targetUserConnectionId: targetUserDetails.connectionId, 
                isCallEnded: true 
            } 
        });
    };

    return (
        <CallModal>
            <h2 className="text-lg font-semibold mb-4">{isCaller ? 'Calling...' : 'Incoming call...'}</h2>
            <VideoContainer
                isCaller={isCaller}
                isCallAccepted={isCallAccepted}
                localVideoRef={localVideoRef}
                remoteVideoRef={remoteVideoRef}
            />
            <CallControls
                isCaller={isCaller}
                isCallAccepted={isCallAccepted}
                handleAcceptCall={handleAcceptCall}
                handleEndCall={handleEndCall}
            />
        </CallModal>
    );
};

export default CallingModal;