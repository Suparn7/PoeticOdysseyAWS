import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ImagePreview = ({ image, handleCancelImage }) => (
  <div className="image-preview-in-message-list">
    <FontAwesomeIcon icon={faTimes} className="cancel-icon" onClick={handleCancelImage} />
    <img src={image} alt="preview" className="preview-image" />
  </div>
);

export default ImagePreview;