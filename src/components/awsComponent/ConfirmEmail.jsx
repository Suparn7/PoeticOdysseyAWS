import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from "react-redux";
import {login } from "../../store/authSlice";
import awsAuthService from "../../aws/awsAuthService";
import { useNavigate } from "react-router-dom";
import dynamoService from "../../aws/dynamoService";
import dynamoUserInformationService from "../../aws/dynamoUserInformationService";
import { setUserData } from "../../store/userSlice";
import awsS3Service from "../../aws/awsS3Service";


const ConfirmEmail = ({ email, password, profilePic, bio, phone, name, userSub }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [otp, setOtp] = useState(""); // OTP input state
    const [error, setError] = useState(""); // Error state
    const [loading, setLoading] = useState(false); // Loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset any previous errors
        setLoading(true); // Show loading spinner
    
        try {
            // Step 1: Confirm the email using the OTP
            await awsAuthService.confirmEmail({ email, confirmationCode: otp });
    
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
    

    return (
        <div>
            <h2>Enter the Confirmation Code</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                />
                <button disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Optionally add a button to resend the OTP */}
        </div>
    );
};

export default ConfirmEmail;
