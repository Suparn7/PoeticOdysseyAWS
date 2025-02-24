import React, { useEffect, useState, useRef } from 'react';
import dynamoUserInformationService from '../../aws/dynamoUserInformationService';
import CallModal from '../CallComponents/CallModal';
import VideoContainer from '../CallComponents/VideoContainer';
import CallControls from '../CallComponents/CallControls';
import AudioContainer from '../CallComponents/AudioContainer';

const CallingModal = ({ peer, peersToCall, onClose, sendJsonMessage, lastJsonMessage, userID, isVideoCall, isCaller }) => {
    const [isCallAccepted, setIsCallAccepted] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localAudioRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const callRef = useRef(null);
    const isVideoCallRef = useRef(isVideoCall);
    const isCallerRef = useRef(isCaller);

    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: isVideoCallRef.current, audio: true });
                setLocalStream(stream);
                if (isVideoCallRef.current && localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing media devices.', error);
            }
        };

        getMediaStream();
    }, [isVideoCallRef.current]);

    useEffect(() => {
        if (peersToCall && localStream) {
            const { receiverPeerId, callerPeerId } = peersToCall;
            if (peer.id === callerPeerId) {
                const call = peer.call(receiverPeerId, localStream);
                callRef.current = call;
                call.on('stream', (remoteStream) => {
                    setRemoteStream(remoteStream);
                    if (isVideoCallRef.current && remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                });
            }
        }
    }, [peersToCall, peer, localStream, isVideoCallRef.current]);

    useEffect(() => {
        if (peersToCall) {
            const { receiverPeerId } = peersToCall;
            if (peer.id === receiverPeerId) {
                peer.on('call', (incomingCall) => {
                    callRef.current = incomingCall;
                });
            }
        }
    }, [peersToCall, peer, isVideoCallRef.current]);

    useEffect(() => {
        if (lastJsonMessage !== null) {

            if (lastJsonMessage?.action === 'sendCallAccepted') {
                // Handle call accepted logic
                console.log('Call accepted:', lastJsonMessage.data);
                setIsCallAccepted(true);
                const getMediaStream = async () => {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: isVideoCallRef.current, audio: true });
                        setLocalStream(stream);
                        if (isVideoCallRef.current && localVideoRef.current) {
                            localVideoRef.current.srcObject = stream;
                        } else if (!isVideoCallRef.current && localAudioRef.current) {
                            localAudioRef.current.srcObject = stream;
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
    }, [lastJsonMessage, isVideoCallRef.current]);

    const handleAcceptCall = async () => {
        console.log("isVideoCall", isVideoCallRef.current);   
        
        const call = callRef.current;
        const { callerUserId } = peersToCall;
        console.log('Accepting call...', call);
        console.log('Local stream:', localStream);
        
        if (call && localStream) {
            call.answer(localStream);
            call.on('stream', (incomingRemoteStream) => {
                console.log("incomingRemoteStream", incomingRemoteStream);
                setRemoteStream(incomingRemoteStream);
                if (isVideoCallRef.current && remoteVideoRef.current) {
                    console.log("isVideoCall", isVideoCallRef.current);
                    remoteVideoRef.current.srcObject = incomingRemoteStream;
                } else if (!isVideoCallRef.current && remoteAudioRef.current) {
                    remoteAudioRef.current.srcObject = incomingRemoteStream;
                }
            });
            setIsCallAccepted(true);
            const callerPeerDetails = await dynamoUserInformationService.getPeerDetailsByUserId(callerUserId);
        
            sendJsonMessage({
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
        const toUpdateCallEndedUserId = isCallerRef.current ? receiverUserId : callerUserId;
        const targetUserDetails = await dynamoUserInformationService.getPeerDetailsByUserId(toUpdateCallEndedUserId);

        sendJsonMessage({
            action: 'sendCallEnded',
            data: {
                targetUserConnectionId: targetUserDetails.connectionId,
                isCallEnded: true
            }
        });
    };

    const getUserDetails = async (userId) => {
        try {
            const userDetails = await dynamoUserInformationService.getUserInfoByUserNameId(userId);
            return userDetails;
        } catch (error) {
            console.error('Failed to fetch user details.', error);
        }
    }

    return (
        <CallModal>
            {/* <h2 className="text-lg font-semibold mb-4">{isCallerRef.current ? 'Calling...' : 'Incoming call...'}</h2> */}
            {isVideoCallRef.current ? (
                <VideoContainer
                    isCaller={isCallerRef.current}
                    isCallAccepted={isCallAccepted}
                    localVideoRef={localVideoRef}
                    remoteVideoRef={remoteVideoRef}
                    getUserDetails={getUserDetails}
                    callerUserId={peersToCall?.callerUserId}
                    receiverUserId={peersToCall?.receiverUserId}
                />
            ) : (
                <AudioContainer
                    isCaller={isCallerRef.current}
                    isCallAccepted={isCallAccepted}
                    localAudioRef={localAudioRef}
                    remoteAudioRef={remoteAudioRef}
                    getUserDetails={getUserDetails}
                    callerUserId={peersToCall?.callerUserId}
                    receiverUserId={peersToCall?.receiverUserId}
                />
            )}
            <CallControls
                isCaller={isCallerRef.current}
                isCallAccepted={isCallAccepted}
                handleAcceptCall={handleAcceptCall}
                handleEndCall={handleEndCall}
            />
        </CallModal>
    );
};

export default CallingModal;