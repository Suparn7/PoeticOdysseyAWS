import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const FileUpload = ({ selectImageFromPC }) => (
  <div className="mb-4 flex flex-col items-center">
    <label
      htmlFor="file-upload"
      className="flex items-center justify-center w-full h-12 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:bg-gradient-to-l hover:from-blue-600 hover:to-blue-400"
    >
      <FontAwesomeIcon icon={faUpload} className="w-5 h-5 mr-2" />
      Upload Image
    </label>
    <input
      id="file-upload"
      type="file"
      accept="image/png, image/jpg, image/jpeg"
      className="hidden"
      onChange={(e) => selectImageFromPC(e.target.files[0])}
    />
  </div>
);

export default FileUpload;