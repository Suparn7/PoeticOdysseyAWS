import React from 'react';

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div className="w-full bg-red-700 bg-opacity-20 backdrop-blur-md rounded-lg p-4 text-red-200 text-center shadow-md mb-6">
            {message}
        </div>
    );
};

export default ErrorMessage;