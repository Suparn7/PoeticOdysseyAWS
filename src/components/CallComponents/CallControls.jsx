import React from 'react';

const CallControls = ({ isCaller, isCallAccepted, handleAcceptCall, handleEndCall }) => (
    <div className="mt-4 flex justify-center">
        {isCaller ? (
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEndCall}
            >
                End Call
            </button>
        ) : (
            <>
                {!isCallAccepted ? (
                    <>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={handleAcceptCall}
                        >
                            Accept Call
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={handleEndCall}
                        >
                            Reject Call
                        </button>
                    </>
                ) : (
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleEndCall}
                    >
                        End Call
                    </button>
                )}
            </>
        )}
    </div>
);

export default CallControls;