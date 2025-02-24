import React, { useState, useRef, useEffect } from 'react';
import './styles/videoContainer.css'; // Import the CSS file for animations
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';

const VideoContainer = ({ isCaller, isCallAccepted, localVideoRef, remoteVideoRef, getUserDetails, callerUserId, receiverUserId }) => {
    const [userDetails, setUserDetails] = useState(null);
    const isCallerRef = useRef(isCaller);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const userId = isCallerRef.current ? receiverUserId : callerUserId;
            const details = await getUserDetails(userId);
            console.log("User details", details);
            
            setUserDetails(details);    
        };

        fetchUserDetails();
    }, [isCallerRef.current, callerUserId, receiverUserId, getUserDetails]);   

    const [isLocalVideoSmall, setIsLocalVideoSmall] = useState(true);
    const [isVideoClicked, setIsVideoClicked] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoHidden, setIsVideoHidden] = useState(false);

    const handleVideoClick = () => {
        setIsLocalVideoSmall((prev) => !prev);
        setIsVideoClicked(true);
        setTimeout(() => {
            setIsVideoClicked(false);
        }, 7000); // Reset the state after 7 seconds
    };

    useEffect(() => {
        const videoElement = localVideoRef.current;
        let isDragging = false;
        let startX, startY, initialX, initialY;

        const onMouseDown = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = videoElement.offsetLeft;
            initialY = videoElement.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                videoElement.style.left = `${initialX + dx}px`;
                videoElement.style.top = `${initialY + dy}px`;
            }
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        videoElement.addEventListener('mousedown', onMouseDown);

        return () => {
            videoElement.removeEventListener('mousedown', onMouseDown);
        };
    }, []);

    return (
        <div className="video-container flex justify-center items-center relative bg-gray-900 p-4 rounded-lg shadow-lg">
            {isCallerRef.current ? (
                isCallAccepted ? (
                    <>
                        <video
                            ref={isLocalVideoSmall ? remoteVideoRef : localVideoRef}
                            autoPlay
                            className="w-full h-full max-h-72 rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-105"
                        />
                        <video
                            ref={isLocalVideoSmall ? localVideoRef : remoteVideoRef}
                            autoPlay
                            muted
                            className={`w-1/4 h-1/4 z-10 absolute top-0 right-0 m-4 border border-white rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-110 ${isVideoClicked ? 'animate-video' : ''}`}
                            onClick={handleVideoClick}
                        />
                    </>
                ) : (
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        className="w-full h-full max-h-72 rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-105"
                    />
                )
            ) : (
                isCallAccepted ? (
                    <>
                        <video
                            ref={isLocalVideoSmall ? localVideoRef : remoteVideoRef}
                            autoPlay
                            muted
                            className={`w-1/4 h-1/4 z-10 absolute top-0 right-0 m-4 border border-white rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-110 ${isVideoClicked ? 'animate-video' : ''}`}
                            onClick={handleVideoClick}
                        />
                        <video
                            ref={isLocalVideoSmall ? remoteVideoRef : localVideoRef}
                            autoPlay
                            className="w-full h-full max-h-72 rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-105"
                        />
                    </>
                ) : (
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        className="w-full h-full max-h-72 rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-105"
                    />
                )
            )}
        </div>
    );
};

export default VideoContainer;