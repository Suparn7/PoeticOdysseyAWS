import React from 'react';

const ImageGrid = ({ images, selectImageFromSearch }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
    {images.map((image) => (
      <div
        key={image.id}
        className="relative w-full h-32 bg-gray-700 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600"
        onClick={() => selectImageFromSearch(image)}
      >
        <img
          src={image.src.small}
          alt={image.alt}
          className="w-full h-full object-cover transition-all duration-300 transform hover:scale-110 hover:brightness-75"
        />
      </div>
    ))}
  </div>
);

export default ImageGrid;