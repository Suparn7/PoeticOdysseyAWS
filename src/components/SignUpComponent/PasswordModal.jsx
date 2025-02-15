import React from 'react';

const PasswordModal = ({ children, onClose }) => (
    <div className="password-modal-overlay" style={modalStyle} onClick={onClose}>
        <div className="password-modal-content" style={contentStyle} onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    </div>
);

// Simple styling for the modal (you can modify as needed)
const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const contentStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
};

export default PasswordModal;