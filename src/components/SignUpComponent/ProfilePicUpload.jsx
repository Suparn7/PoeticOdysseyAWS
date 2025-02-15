import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const ProfilePicUpload = ({ register, watch }) => {
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const profilePic = watch("profilePic");

    useEffect(() => {
        if (profilePic && profilePic[0]) {
            const file = profilePic[0];
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePicPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setProfilePicPreview(null);
        }
    }, [profilePic]);

    return (
        <div className="relative">
            <label
                htmlFor="profilePic"
                className="flex items-center justify-center bg-white bg-opacity-20 text-gray-400 rounded-lg py-3 border border-dashed border-gray-400 cursor-pointer"
            >
                <FontAwesomeIcon icon={faUpload} className="mr-2 text-white" />
                Upload Profile Picture (optional)
            </label>
            <input
                {...register("profilePic")}
                id="profilePic"
                type="file"
                className="hidden"
            />
            {profilePicPreview && (
                <img
                    src={profilePicPreview}
                    alt="Profile Preview"
                    className="mt-4 w-20 h-20 rounded-full object-cover mx-auto"
                />
            )}
        </div>
    );
};

export default ProfilePicUpload;