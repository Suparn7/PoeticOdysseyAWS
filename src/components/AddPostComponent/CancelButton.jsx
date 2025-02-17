import React from 'react';

const CancelButton = ({ setShowConfirm }) => (
  <button
    onClick={(e) => { 
      e.preventDefault(); // Prevent form submission
      setShowConfirm(true); // Show confirmation modal
    }}
    className="absolute m-0 p-0 border-double top-4 right-4 w-8 h-8 bg-transparent text-white flex items-center justify-center rounded-full hover:bg-black hover:opacity-80 transition-all"
    aria-label="Cancel"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

export default CancelButton;