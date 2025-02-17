import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { setUserData } from '../store/userSlice';
import userService from '../appwrite/userService';
import authService from '../appwrite/auth';
import logo from "../images/PoeticOddyseyLogoBg.png";
import conf from '../conf/conf';
import "../styles/loader.css"

// Importing FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPhone, faEnvelope, faCamera, faHeart, faBookmark, faBan, faFloppyDisk, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Container from './container/Container';
import service from '../appwrite/config';
import FollowDetailsModal from './UsersModal/FollowDetailsModal/FollowDetailsModal';
import awsAuthService from '../aws/awsAuthService';
import dynamoUserInformationService from '../aws/dynamoUserInformationService';
import awsS3Service from '../aws/awsS3Service';
import useWebSocketService from '../webSocketServices/useWebSocketService';
import EditProfileButton from './ProfileComponent/EditProfileButton';
import SaveCancelButtons from './ProfileComponent/SaveCancelButtons';
import ProfilePictureUpload from './ProfileComponent/ProfilePictureUpload';
import ProfileNameSection from './ProfileComponent/ProfileNameSection';
import UserPostsButton from './ProfileComponent/UserPostsButton';
import LikedSavedPostsButtons from './ProfileComponent/LikedSavedPostsButtons';
import ContactInfoSection from './ProfileComponent/ContactInfoSection';
import ProfileBioSection from './ProfileComponent/ProfileBioSection';
import FollowButtonsSection from './ProfileComponent/FollowButtonsSection';

import {
    handleNameChange,
    handleBioChange,
    handleEmailChange,
    handlePhoneChange,
    handleProfilePicChange,
    handleSaveClick,
    saveProfile,
    handleCancelClick,
    handleFollowClick,
    fetchFollowers,
    fetchFollowing,
    closeModal,
    handleCancelConfirmModalClick
} from '../actions/profileActions';

const Profile = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    const userInfoData = useSelector((state) => state.user.userData);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(userInfoData?.name || '');
    const [bio, setBio] = useState(userInfoData?.bio || '');
    const [email, setEmail] = useState(userInfoData?.email || '');
    const [phone, setPhone] = useState(userInfoData?.phone || '');
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(userInfoData?.profilePicUrl || logo);

    // State for the password modal
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
    const profileId = useParams();
    const [isAuthUser, setIsAuthUser] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [modalType, setModalType] = useState(null); // 'followers' or 'following'
    const [followers, setFollowers] = useState(null); // 'followers' or 'following'
    const [following, setFollowing] = useState(null); // 'followers' or 'following'
    const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
    const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
    const [isFollowingOrUnfollowing, setIsFollowingOrUnfollowing] = useState(false);
    let socketUrl;

    if (userInfoData) {
        socketUrl = `wss://w613ebu3th.execute-api.ap-south-1.amazonaws.com/production/?profileUserId=${userInfoData.userId}`;
    }

    const { sendJsonMessage, lastJsonMessage } = useWebSocketService(socketUrl);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading

            try {
                if (userInfoData && profileId.slug && userInfoData.userId !== profileId.slug) {
                    setIsAuthUser(false);
                    // For someone else's profile, fetch their data
                    const userProfileDetails = await dynamoUserInformationService.getUserInfoByUserNameId(profileId.slug);

                    setIsFollowing(await dynamoUserInformationService.isFollowing(userInfoData.userId, profileId.slug));

                    setName(userProfileDetails.name);
                    setBio(userProfileDetails.bio);
                    setEmail(userProfileDetails.email);
                    setPhone(userProfileDetails.phoneNumber);
                    setProfilePicUrl(userProfileDetails.profilePicUrl || logo); // Use the user's profile picture if available
                } else {
                    // For your own profile, use the userData from Redux
                    if (userInfoData) {
                        setIsAuthUser(true);
                        setName(userInfoData.name);
                        setBio(userInfoData.bio);
                        setEmail(userInfoData.email);
                        setPhone(userInfoData.phoneNumber);
                        setProfilePicUrl(userInfoData.profilePicUrl || logo); // Fallback to default logo if no profile pic
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false); // Hide loading after data is fetched
            }
        };

        fetchData();
    }, [profileId, userInfoData]); // Re-run if profileId or userInfoData changes

    if (loading || isLoadingFollowers || isLoadingFollowing) {
        return (
            <Container>
                <div className="loader-overlay">
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                </div>
            </Container>
        );
    }

    if (!userInfoData) {
        return <div className="container mx-auto p-4">No user data found.</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="rounded-lg shadow-xl p-6 w-11/12 max-w-lg overflow-x-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative"
                style={{
                    background: "rgba(0, 0, 0, 0)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                }}>

                {/* Edit Profile Button in the top-right corner */}
                {!isEditing && isAuthUser && (
                    <EditProfileButton onClick={() => setIsEditing(true)} />
                )}

                {/* Save Button */}
                {isEditing && isAuthUser && (
                    <SaveCancelButtons onSaveClick={() => handleSaveClick(() => saveProfile(profilePic, userInfoData, name, bio, email, phone, dispatch, setIsEditing, password), setIsEditing)} onCancelClick={() => handleCancelClick(userInfoData, setName, setBio, setEmail, setPhone, setProfilePicUrl, setIsEditing)} />
                )}

                {/* Profile Content */}

                {/* Profile Picture, Name, Bio, Contact Info Sections */}
                <div className="flex flex-col items-center space-y-6 w-full">

                    {/* Profile Picture with upload icon */}
                    <ProfilePictureUpload
                        profilePicUrl={profilePicUrl}
                        isEditing={isEditing}
                        handleProfilePicChange={(e) => handleProfilePicChange(e, setProfilePic, setProfilePicUrl)}
                    />

                    {/* Name Section */}
                    <ProfileNameSection
                        isEditing={isEditing}
                        name={name}
                        handleNameChange={(e) => handleNameChange(e, setName)}
                    />

                    {/* Bio Section below Name */}
                    <ProfileBioSection
                        isEditing={isEditing}
                        bio={bio}
                        handleBioChange={(e) => handleBioChange(e, setBio)}
                    />

                    {/* Follow Buttons Section */}
                    {!isEditing && (
                        <FollowButtonsSection
                            isAuthUser={isAuthUser}
                            isFollowing={isFollowing}
                            isFollowingOrUnfollowing={isFollowingOrUnfollowing}
                            handleFollowClick={() => handleFollowClick(userInfoData, profileId, isFollowing, setIsFollowing, setIsFollowingOrUnfollowing, sendJsonMessage, dispatch)}
                            fetchFollowing={() => fetchFollowing(profileId, userInfoData, setFollowing, setIsFollowModalOpen, setModalType, setIsLoadingFollowing)}
                            fetchFollowers={() => fetchFollowers(profileId, userInfoData, setFollowers, setIsFollowModalOpen, setModalType, setIsLoadingFollowers)}
                        />
                    )}

                    {/* "Posts by Username" Button */}
                    {!isAuthUser && (
                        <UserPostsButton profileId={profileId} name={name} />
                    )}

                    {/* Modal for Followers/Following */}
                    <FollowDetailsModal
                        isOpen={isFollowModalOpen}
                        closeModal={() => closeModal(setIsFollowModalOpen)}
                        modalType={modalType}
                        followers={followers}
                        following={following}
                    />

                    {/* Liked & Saved Posts (below Name) with Cool Animated Buttons */}
                    {!isEditing && isAuthUser && (
                        <LikedSavedPostsButtons />
                    )}

                    {/* Contact Info Section */}
                    <ContactInfoSection
                        isEditing={isEditing}
                        email={email}
                        phone={phone}
                        handleEmailChange={(e) => handleEmailChange(e, setEmail)}
                        handlePhoneChange={(e) => handlePhoneChange(e, setPhone)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Profile;