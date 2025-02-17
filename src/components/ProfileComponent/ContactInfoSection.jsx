import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const ContactInfoSection = ({ isEditing, email, phone, handleEmailChange, handlePhoneChange }) => {
    return (
        <div className="rounded-lg p-6 w-full mt-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl"
            style={{ background: "rgba(0,0,0,0.3)" }}
        >
            <h2 className="text-xl font-semibold mb-4 animate__animated animate__fadeInUp">Contact Information</h2>

            {/* Editable Email */}
            {isEditing ? (
                <div className="flex items-center space-x-2 mb-4 ">
                    <FontAwesomeIcon icon={faEnvelope} className="text-indigo-500 text-2xl" />
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="text-lg bg-transparent border-2 border-indigo-500 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full rounded-lg transform transition duration-300 hover:scale-105"
                    />
                </div>
            ) : (
                <p className="text-lg flex items-center mb-4">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-indigo-500" />
                    {email}
                </p>
            )}

            {/* Editable Phone */}
            {isEditing ? (
                <div className="flex items-center space-x-2 mb-4">
                    <FontAwesomeIcon icon={faPhone} className="text-indigo-500 text-2xl" />
                    <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="text-lg bg-transparent border-2 border-indigo-500 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full rounded-lg transform transition duration-300 hover:scale-105"
                    />
                </div>
            ) : phone && (
                <p className="text-lg flex items-center mb-4">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-indigo-500" />
                    {phone}
                </p>
            )}
        </div>
    );
};

export default ContactInfoSection;