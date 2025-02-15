import React from 'react';

const ErrorMessage = ({ error }) => (
    error && (
        <div className="mb-4 bg-red-700 bg-opacity-20 backdrop-blur-md rounded-lg p-4 text-red-200 text-center shadow-md">
            {error}
        </div>
    )
);

export default ErrorMessage;