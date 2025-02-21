import React from 'react';

const CallModal = ({ children }) => (
    <div className="call-modal">
        <div className="fixed top-6 left-4 w-11/12 h-4/5 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-600 rounded-lg p-8 flex flex-col items-center max-w-md mx-auto relative">
                {children}
            </div>
        </div>
    </div>
);

export default CallModal;