import React, { useEffect, useState, useRef } from 'react';
import './styles/audioContainer.css';

const AudioContainer = ({ isCaller, isCallAccepted, localAudioRef, remoteAudioRef, getUserDetails, callerUserId, receiverUserId }) => {
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

    return (
        <div className="audio-container text-white">
            <h3>{isCallerRef.current ? 'Calling...' : 'Incoming call...'}</h3>
            {userDetails && (
                <div className="user-info">
                    <img src={userDetails.profilePicUrl || "https://avatar.iran.liara.run/public/boy?username=Ash"} alt="User Profile" className="call-profile-pic" />
                    <p>{userDetails.name}</p>
                </div>
            )}
            <div className="audio-wrapper">
                <audio ref={localAudioRef} autoPlay />
                {isCallAccepted && <audio ref={remoteAudioRef} autoPlay />}
            </div>
        </div>
    );
};

export default AudioContainer;