import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';

const CallModal = ({ peer, peersToCall, setIsCallModalOpen }) => {
    //THIS MODAL IS DUMMY FOR PRANK : NOT USED ANYWHERE
    const [remoteStream, setRemoteStream] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [currentCall, setCurrentCall] = useState(null);
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [isCallAccepted, setIsCallAccepted] = useState(false);
    const [streamInitialized, setStreamInitialized] = useState(false);

    useEffect(() => {
        let call;
        const initializeCall = async () => {
            try {
                // Get local media stream
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream; // Set local video stream
                }
                setStreamInitialized(true); // Mark stream as initialized

                // Function to initiate a call
                const callPeer = (peerId) => {
                    if (peer && peerId) {
                        call = peer.call(peerId, stream);
                        setCurrentCall(call);

                        call.on('stream', remoteStream => {
                            if (remoteVideoRef.current) {
                                remoteVideoRef.current.srcObject = remoteStream; // Set remote video stream
                                setRemoteStream(remoteStream);
                            }
                        });
                    }
                };

                // Call or wait for incoming call
                if (peer && peer.open) {
                    callPeer(peersToCall.receiverPeerId);
                } else {
                    peer.on('open', () => callPeer(peersToCall.receiverPeerId));
                }

                // Handle incoming calls
                peer.on('call', incomingCall => {
                    setIsIncomingCall(true);
                    setCurrentCall(incomingCall);
                    incomingCall.answer(stream); // Automatically answer with local stream

                    incomingCall.on('stream', remoteStream => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream; // Set remote stream for incoming calls
                            setRemoteStream(remoteStream);
                        }
                    });
                });

            } catch (error) {
                console.error("Failed to get local stream", error);
            }
        };

        initializeCall();

        return () => {
            if (currentCall) {
                currentCall.close();
            }
            if (localVideoRef.current && localVideoRef.current.srcObject) {
                const tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [peer, peersToCall]);

    const acceptCall = () => {
        if (currentCall && streamInitialized) { // Check if stream is initialized before answering
            currentCall.answer(localVideoRef.current.srcObject); // Answer with local stream
            setIsIncomingCall(false); // Update state to indicate that the call has been accepted
            setIsCallAccepted(true); // Set state to indicate that the call has been accepted
        }
    };

    const endCall = () => {
        if (currentCall) {
            currentCall.close();
            setCurrentCall(null);
        }

        if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
            remoteVideoRef.current.srcObject = null;
            setRemoteStream(null);
        }

        if (localVideoRef.current && localVideoRef.current.srcObject) {
            const tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            localVideoRef.current.srcObject = null;
        }
        setIsCallModalOpen(false);
    };
    console.log("isIncomingCall", isIncomingCall);
    

    return (
        <div className="fixed top-0 left-0 w-full h-3/4 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-600 rounded-lg p-8 flex flex-col items-center max-w-md mx-auto relative" style={{ height: '70vh' }}>
                <h2 className="text-lg font-semibold mb-4">{isIncomingCall ? 'Incoming Call...' : 'Calling...'}</h2>

                {/* Main Video Display */}
                {isIncomingCall ? (
                    <video ref={remoteVideoRef} autoPlay className="w-64 h-64 rounded-lg shadow-md" />
                ) : (
                    <video ref={isCallAccepted ? remoteVideoRef : localVideoRef} autoPlay muted={!isCallAccepted} className="w-full h-full rounded-lg shadow-md" />
                )}

                {/* Local Video Preview (Top Right Corner) */}
                {isCallAccepted && (
                    <video
                        ref={localVideoRef}
                        autoPlay muted
                        className="absolute top-4 right-4 w-32 h-24 rounded-lg shadow-md"
                    />
                )}

                <div className="mt-4 flex justify-center">
                    {isIncomingCall ? (
                        <button
                            onClick={acceptCall}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            Accept Call
                        </button>
                    ) : null}
                    <button
                        onClick={endCall}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        End Call
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallModal;
