import { setUserData } from '../store/userSlice';
import awsS3Service from '../aws/awsS3Service';
import dynamoUserInformationService from '../aws/dynamoUserInformationService';
import awsAuthService from '../aws/awsAuthService';
import logo from "../images/PoeticOddyseyLogoBg.png";

export const handleNameChange = (e, setName) => setName(e.target.value);
export const handleBioChange = (e, setBio) => setBio(e.target.value);
export const handleEmailChange = (e, setEmail) => setEmail(e.target.value);
export const handlePhoneChange = (e, setPhone) => setPhone(e.target.value);

export const handleProfilePicChange = (e, setProfilePic, setProfilePicUrl) => {
    const file = e.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setProfilePic(file);
        setProfilePicUrl(imageUrl);
    }
};

export const handleSaveClick = async (saveProfile, setIsEditing) => {
    await saveProfile();
    setIsEditing(false);
};

export const saveProfile = async (profilePic, userInfoData, name, bio, email, phone, dispatch, setIsEditing, password) => {
    try {
        let uploadedUrl = "";
        if (profilePic) {
            const file = profilePic;
            const timestamp = Date.now();
            const fileName = `profile-pics/${email}-${timestamp}-${file.name}`;
            const fileBody = file;
            const contentType = file.type;

            uploadedUrl = await awsS3Service.uploadFileToS3({
                bucketName: "poetic-odyssey-images",
                fileName,
                fileBody,
                contentType,
            });

            if (userInfoData && userInfoData.profilePicUrl) {
                const key = userInfoData.profilePicUrl.split('.com/')[1];
                await awsS3Service.deleteFileFromS3({
                    bucketName: "poetic-odyssey-images",
                    fileName: key
                });
            }

            if (uploadedUrl) {
                await dynamoUserInformationService.updateUserInfo(userInfoData.userId, { name, bio, profilePicUrl: uploadedUrl, email, phoneNumber: phone });
                dispatch(setUserData({ ...userInfoData, profilePicUrl: uploadedUrl, name, bio, email, phoneNumber: phone }));
            }
        } else {
            await dynamoUserInformationService.updateUserInfo(userInfoData.userId, { name, bio, email, phoneNumber: phone });
            dispatch(setUserData({ ...userInfoData, name, bio, email, phoneNumber: phone }));
        }

        if (email !== userInfoData.email || name !== userInfoData.name) {
            await awsAuthService.updateUserData(email, name, password, dispatch);
        }

        setIsEditing(false);
    } catch (error) {
        console.error("Error saving profile:", error);
    }
};

export const handleCancelClick = (userInfoData, setName, setBio, setEmail, setPhone, setProfilePicUrl, setIsEditing) => {
    setName(userInfoData?.name || '');
    setBio(userInfoData?.bio || '');
    setEmail(userInfoData?.email || '');
    setPhone(userInfoData?.phoneNumber || '');
    setProfilePicUrl(userInfoData?.profilePicUrl || logo);
    setIsEditing(false);
};

export const handleFollowClick = async (userInfoData, profileId, isFollowing, setIsFollowing, setIsFollowingOrUnfollowing, sendJsonMessage, dispatch) => {
    try {
        setIsFollowingOrUnfollowing(true);
        const currentUserId = userInfoData.userId;
        const targetUserId = profileId?.slug;

        if (isFollowing) {
            const unfollowSuccess = await dynamoUserInformationService.unfollowUser(currentUserId, targetUserId);
            if (unfollowSuccess) {
                setIsFollowing(false);
                sendJsonMessage({
                    action: "onUnfollowUser",
                    data: { unfollowedUserId: targetUserId, unfollowerId: currentUserId }
                });
            } else {
                console.log("Failed to unfollow");
            }
        } else {
            const followSuccess = await dynamoUserInformationService.followUser(currentUserId, targetUserId, dispatch);
            if (followSuccess) {
                setIsFollowing(true);
                sendJsonMessage({
                    action: "onFollowUser",
                    data: { followedUserId: targetUserId, followerId: currentUserId }
                });
            } else {
                console.log("Failed to follow");
            }
        }
    } catch (error) {
        console.error("Error handling follow/unfollow action", error);
    } finally {
        setIsFollowingOrUnfollowing(false);
    }
};

export const fetchFollowers = async (profileId, userInfoData, setFollowers, setIsFollowModalOpen, setModalType, setIsLoadingFollowers) => {
    try {
        setIsLoadingFollowers(true);
        let followersData;
        if (profileId?.slug) {
            followersData = await dynamoUserInformationService.getFollowers(profileId.slug);
        } else {
            followersData = await dynamoUserInformationService.getFollowers(userInfoData.userId);
        }

        if (!Array.isArray(followersData)) {
            throw new Error("Following data is not an array of user IDs.");
        }

        const userPromises = followersData.map(userId => dynamoUserInformationService.getUserInfoByUserNameId(userId));
        const usersInfo = await Promise.all(userPromises);

        setFollowers(usersInfo);
        setIsFollowModalOpen(true);
        setModalType("followers");
    } catch (error) {
        console.error("Error fetching followers", error);
    } finally {
        setIsLoadingFollowers(false);
    }
};

export const fetchFollowing = async (profileId, userInfoData, setFollowing, setIsFollowModalOpen, setModalType, setIsLoadingFollowing) => {
    try {
        setIsLoadingFollowing(true);
        let followingData;
        if (profileId?.slug) {
            followingData = await dynamoUserInformationService.getFollowing(profileId.slug);
        } else {
            followingData = await dynamoUserInformationService.getFollowing(userInfoData.userId);
        }

        if (!Array.isArray(followingData)) {
            throw new Error("Following data is not an array of user IDs.");
        }

        const userPromises = followingData.map(userId => dynamoUserInformationService.getUserInfoByUserNameId(userId));
        const usersInfo = await Promise.all(userPromises);

        setFollowing(usersInfo);
        setIsFollowModalOpen(true);
        setModalType("following");
    } catch (error) {
        console.error("Error fetching following", error);
    } finally {
        setIsLoadingFollowing(false);
    }
};

export const closeModal = (setIsFollowModalOpen) => {
    setIsFollowModalOpen(false);
    window.scrollTo(0, 0);
};

export const handleCancelConfirmModalClick = (setIsConfirmModalOpen, setPassword, setIsPasswordCorrect) => {
    setIsConfirmModalOpen(false);
    setPassword('');
    setIsPasswordCorrect(true);
};