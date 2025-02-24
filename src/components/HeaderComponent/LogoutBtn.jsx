import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { clearUserData } from '../../store/userSlice';
import { clearUserNotification } from '../../store/notificationSlice';
import "../../styles/logout.css"
import awsAuthService from '../../aws/awsAuthService';
import { clearPosts } from '../../store/postSlice';
import { faSignOutAlt, faPowerOff, faDoorOpen, faEject } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import LogoutModal from './LogoutModal';

const LogoutBtn = ({handleMenuToggle, title}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false); // State for confirmation modal

    const logoutHandler = () => {
        console.log("CLICKEDDD");
        
        setShowConfirm(true); // Show confirmation modal
        
    };

    const confirmLogout = async () => {
        await awsAuthService.logout();
        dispatch(logout());
        dispatch(clearUserData());
        dispatch(clearUserNotification()); // Clear notifications
        dispatch(clearPosts()); // Clear posts
        setShowConfirm(false); // Close confirmation modal

        //adding this check because menu toggle function is hit for hamburger icon toggle as well
        if(handleMenuToggle !== undefined) handleMenuToggle()
        navigate("/PoeticOdyssey/login");
    };

    const cancelLogout = () => {
        setShowConfirm(false); // Close confirmation modal
    };

    return (
        <div className="relative">
            {/* Confirmation Modal */}
            {showConfirm && (
               <LogoutModal confirmLogout={confirmLogout} cancelLogout={cancelLogout} />
            )}

            {/* Logout Button */}
            <div className='flex justify-center items-center'>
            <Tippy
                key={"Notification"}
                content={
                    <span className="whitespace-nowrap animate-pulse w-auto text-slate-200 bg-gray-800 p-1 rounded-lg text-xs">
                        {title}
                    </span>
                }  
                placement="top"
                theme="dark"
                interactive={true}
                delay={[300, 0]}
                appendTo={() => document.body}
            >
                <button
                    className="inline-block ml-0 mr-0 px-3 py-2 text-2xl text-white bg-red-600 rounded-full shadow-lg transition duration-300 transform hover:bg-red-700 hover:scale-105 hover:shadow-xl"
                    onClick={logoutHandler}
                    title={title}
                >
                    <FontAwesomeIcon icon={faPowerOff} className="" />
                </button>
            </Tippy>
            </div>
            

            
        </div>
    );
}

export default LogoutBtn;
