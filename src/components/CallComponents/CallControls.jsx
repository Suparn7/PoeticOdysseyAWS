import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSlash, faPhone, faTimes } from '@fortawesome/free-solid-svg-icons';

const CallControls = ({ isCaller, isCallAccepted, handleAcceptCall, handleEndCall }) => {
    return (
        <div className="mt-4 flex justify-center">
            {isCaller ? (
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleEndCall}
                >
                    <FontAwesomeIcon icon={faPhoneSlash} className='' />
                </button>
            ) : (
                <>
                    {!isCallAccepted ? (
                        <>
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                                onClick={handleAcceptCall}
                            >
                                <FontAwesomeIcon icon={faPhone} />
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                onClick={handleEndCall}
                            >
                                <FontAwesomeIcon icon={faTimes} />

                            </button>
                        </>
                    ) : (
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleEndCall}
                        >
                            <FontAwesomeIcon icon={faPhoneSlash} />
                        </button>
                    )}
                </>
            )}
        </div>
    )
}
    

export default CallControls;