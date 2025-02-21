import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faImage, faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";

const ChatInput = ({ message, setMessage, handleSendMessage, isUploading, handleImageChange, fileInputRef }) => (
  <div className="chat-input">
    <div className="chat-input-icons">
      <label htmlFor="file-input">
        <FontAwesomeIcon icon={faImage} className="icon" />
      </label>
      <input
        ref={fileInputRef}
        id="file-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      
    </div>
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message..."
    />
    <button onClick={handleSendMessage}>
      {isUploading ? (
        <FontAwesomeIcon icon={faSpinner} spin size="lg" />
      ) : (
        <FontAwesomeIcon icon={faPaperPlane} size="lg" />
      )}
    </button>
  </div>
);

export default ChatInput;