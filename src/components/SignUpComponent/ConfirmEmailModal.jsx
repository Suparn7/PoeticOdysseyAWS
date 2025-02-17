import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import awsAuthService from "../../aws/awsAuthService";
import { useNavigate } from "react-router-dom";
import dynamoService from "../../aws/dynamoService";
import dynamoUserInformationService from "../../aws/dynamoUserInformationService";
import { setUserData } from "../../store/userSlice";
import awsS3Service from "../../aws/awsS3Service";
import './styles/confirmEmailModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faRedo } from '@fortawesome/free-solid-svg-icons';

const ConfirmEmailModal = ({ email, password, profilePic, bio, phone, name, userSub, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [otp, setOTP] = useState(Array(6).fill(""));
    const [error, setError] = useState(""); // Error state
    const [resendTimeout, setResendTimeout] = useState(60); // Timeout in seconds
    const [loading, setLoading] = useState(false); // Loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset any previous errors
        setLoading(true); // Show loading spinner
    
        try {
            // Step 1: Confirm the email using the OTP
            // Convert the OTP array to a string
            //const confirmationCode = otp.join('');
            await awsAuthService.confirmEmail({ email, confirmationCode:  otp.join('') });
    
            // Step 2: Once email is confirmed, log in the user
            const loginData = await awsAuthService.login({
                email: email,
                password: password,
            });
            dispatch(login(loginData))
    
            // Step 3: Upload profile picture if provided
            let uploadedUrl = "";
            if (profilePic && profilePic[0]) {
                const file = profilePic[0];
                const timestamp = Date.now(); // Get the current timestamp
                const fileName = `profile-pics/${email}-${timestamp}-${file.name}`;
                const fileBody = file;
                const contentType = file.type;
    
                // Upload to S3 using dynamoService
                uploadedUrl = await awsS3Service.uploadFileToS3({
                    bucketName: "poetic-odyssey-images", // S3 bucket name
                    fileName,
                    fileBody,
                    contentType,
                });
            }
    
            // Step 4: Save user information in DynamoDB 'userInformation' table
           
            const userInfo = {
                userSub,
                email,
                name,
                bio,
                phoneNumber: phone,
                profilePicUrl: uploadedUrl || "", // Use uploaded URL if available
            };
    
            // Create user in DynamoDB
            const creationResponse = await dynamoUserInformationService.createUser(userInfo);
    
            // Fetch full user data from the database to include fields like likedPosts, savedPosts, etc.
            const fullUserData = await dynamoUserInformationService.getUserInfoByUserNameId(userSub); // Ensure this method is implemented in your service
    
            // Step 5: Update Redux store with all user data
            dispatch(setUserData(fullUserData));
    
            // Navigate to the main app page after login
            navigate("/PoeticOdyssey");
    
        } catch (err) {
            setError("Error confirming email: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    
    const handleResendOTP = async () => {
        setLoading(true);
        setError("");

        try {
            // Trigger AWS Lambda or AWS Amplify function to resend OTP
            await awsAuthService.resendConfirmationCode(email);
            console.log("OTP resent successfully");
            setResendTimeout(60); // Reset the timeout
        } catch (err) {
            setError("Error resending OTP: " + err.message);
        } finally {
            setLoading(false);
        }

    };

    
    const handleChange = (e, index) => {

        const value = e.target.value;
    
        if (/^[0-9]$/.test(value) || value === "") {
    
        const newOTP = [...otp];
    
        newOTP[index] = value;
    
        setOTP(newOTP);
    
        if (value !== "" && index < otp.length - 1) {
    
        document.getElementById(`otp-input-${index + 1}`).focus();
    
        }
    
        }
    
    };

    
    const renderButton = (buttonProps) => {

        return (
    
        <div className="resend-container">
        <FontAwesomeIcon
        icon={faRedo}
        className={`resend-icon ${buttonProps.disabled ? 'disabled' : ''}`}
        onClick={!buttonProps.disabled ? buttonProps.onClick : null}
        />
    
        </div>
    
        );
    
    };

    useEffect(() => {

    if (resendTimeout > 0) {

        const timer = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);

        return () => clearTimeout(timer);

    }

    }, [resendTimeout]);

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal-content">
                <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={onClose} />
                <h2 className="text-black">Enter the Confirmation Code</h2>
                <div className="otp-input">
                    {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        maxLength="1"
                        disabled={loading}
                        className="otp-input-field"
                    />
                    ))}
                </div>
                <div className="resend-container">
                    
                    {resendTimeout > 0 ? <span>Retry in {resendTimeout}s </span> : 
                    <button
                        onClick={resendTimeout > 0 || loading ? null : handleResendOTP}
                    >
                        <FontAwesomeIcon
                            icon={faRedo}
                            className={`resend-icon ${resendTimeout > 0 || loading ? 'disabled' : ''}`}
                        
                        />
                        {" "}
                        Resend OTP
                        
                    </button>
                    }
                </div>
                <div className="flex justify-center items-center">
                    <button className="verifying-btn" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </div>
                



                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Optionally add a button to resend the OTP */}
            </div>
        </div>
    );
};

export default ConfirmEmailModal;