import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhone } from '@fortawesome/free-solid-svg-icons';

const MissedCallMessage = ({ messageContent, isVideoCall }) => {
  const icon = isVideoCall ? <FontAwesomeIcon className="text-red-700 animate-pulse" icon={faVideo} /> : <FontAwesomeIcon className="text-red-700 animate-pulse" icon={faPhone} />;
  const callType = isVideoCall ? 'video' : 'audio';

  return (
    <div className={`missed-call-message ${isVideoCall ? 'video-call' : 'audio-call'}`}>
      <p>
        {icon} Missed {callType} call from {messageContent.includes('from') ? messageContent.split('from')[1].split('at')[0].trim() : ''} at {messageContent.includes('at') ? messageContent.split('at')[1].trim() : ''}
      </p>
    </div>
  );
};

export default MissedCallMessage;
