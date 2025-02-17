import React from 'react';

const SelectedImage = ({ selectedImage, cancelSelectedImage }) => (
  <div className="w-full mb-4 relative">
    <div className="relative w-full">
      <img
        src={selectedImage}
        alt="Selected"
        className="w-full h-64 object-cover rounded-lg shadow-2xl transition-all duration-500 transform hover:scale-105 hover:opacity-"
      />
      <button
        onClick={cancelSelectedImage}
        className="p-0 absolute -top-1 -right-1 w-8 h-8 bg-slate-500 text-white flex items-center justify-center rounded-full hover:bg-black hover:opacity-80 transition-all duration-300 transform hover:scale-110"
        aria-label="Remove image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);

export default SelectedImage;