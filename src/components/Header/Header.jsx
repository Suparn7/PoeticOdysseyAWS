import React, { useState, useRef, useEffect } from 'react';
import Container from '../container/Container';
import Logo from '../Logo';
import { Link, useNavigate } from 'react-router-dom';
import LogoutBtn from './LogoutBtn';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { setUserNotifications, addUserNotification, deleteUserNotification } from "../../store/notificationSlice"; 
import useWebSocketService from '../../webSocketServices/useWebSocketService';
import dynamoService from '../../aws/dynamoService';
import { faHome, faSignInAlt, faUserPlus, faUserCircle, faBell, faComments, faBookOpen, faPencilAlt, faCoffee } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import 'tippy.js/themes/light.css'; // optional theme



const Header = React.memo(() => {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.user.userData);
    //const notifications = useSelector((state) => state.notifications.notifications);
    const [notifications, setNotifications] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const[notificationsVisibleForSmallScreen, setNotificationsVisibleForSmallScreen] = useState(false);
    const [deletingNotification, setDeletingNotification] = useState(null); 
    const [loading, setLoading] = useState(true); // To handle loading state if needed
    const [notificationSocketUrl, setNotificationSocketUrl] = useState(null);
    
    const menuRef = useRef(null);
    const notificationRef = useRef(null); 
    const notificationRefForSmScreen = useRef(null); 

    const notificationBellRef = useRef(null); // Ref for the notification bell
    const notificationBellRefForSmScreen = useRef(null); // Ref for the notification bell


    const navItems = [
        { name: "Home", slug: "/PoeticOdyssey", active: true, icon: faHome },
        { name: "Login", slug: "/PoeticOdyssey/login", active: !authStatus, icon: faSignInAlt },
        { name: "Signup", slug: "/PoeticOdyssey/signup", active: !authStatus, icon: faUserPlus },
        { name: "Add Post", slug: "/PoeticOdyssey/add-post", active: authStatus, icon: faPencilAlt },
        { name: "My Posts", slug: "/PoeticOdyssey/my-posts", active: authStatus, icon: faBookOpen },
        { name: "Profile", slug: "/PoeticOdyssey/profile", active: authStatus, icon: faUserCircle },
        { name: "Chats", slug: "/PoeticOdyssey/chat", active: authStatus, icon: faComments },
    ];
    

    useEffect(() => {
        if (userData?.userId) {
          setNotificationSocketUrl(`wss://l8eegkbrkd.execute-api.ap-south-1.amazonaws.com/production/?userId=${userData.userId}`);
        }
      }, [userData]);
      
    const { sendJsonMessage: sendNotificationJsonMessage, lastJsonMessage: lastNotificationJsonMessage } = useWebSocketService(notificationSocketUrl);


    const handleMenuToggle = () => {
        if(notificationsVisible) setNotificationsVisible(false)
        if(notificationsVisibleForSmallScreen) setNotificationsVisibleForSmallScreen(false)

        setMenuVisible((prev) => !prev);
    };

    const handleNotificationToggle = () => {
        // Close the menu modal
       setNotificationsVisible((prev) => !prev); // Toggle notifications modal
       
       if (menuVisible) setMenuVisible(false);
    }

   const handleNotificationToggleForSmallScreen = () => {
        // Close the menu modal
        setNotificationsVisibleForSmallScreen((prev) => !prev); // Toggle notifications modal
        if (menuVisible) setMenuVisible(false);
    }

   const handleClickOutside = (event) => {
    // Close menu if clicked outside
    if (
      menuVisible &&
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setMenuVisible(false);
    }
    // Close notifications if clicked outside and not on the bell
    if (
      notificationsVisible &&
      notificationRef.current &&
      !notificationRef.current.contains(event.target) &&
      (!notificationBellRef.current || !notificationBellRef.current.contains(event.target))
    ) {
        setNotificationsVisible(false);
    }

    if (
        notificationsVisibleForSmallScreen &&
        notificationRefForSmScreen.current &&
        !notificationRefForSmScreen.current.contains(event.target) &&
        (!notificationBellRefForSmScreen.current || !notificationBellRefForSmScreen.current.contains(event.target))
      ) {
       setNotificationsVisibleForSmallScreen(false);
      }
  };

  const getCreativeTitle = (itemName) => {
    switch (itemName) {
        case "Home":
            return "Embark on a Poetic Journey";
        case "Login":
            return "Unlock the Realm of Words";
        case "Signup":
            return "Join Our Literary Constellation";
        case "Add Post":
            return "Share Your Poetic Soul";
        case "My Posts":
            return "Reflect on Your Literary Footprints";
        case "Profile":
            return "Explore Your Creative Universe";
        case "Chats":
            return "Whispers Among Wordsmiths";
        case "Logout":
            return "Bid Adieu to the Muse";
        case "Notification":
            return "Ding Ding! Whispers in the Wind";
        default:
            return `Navigate to ${itemName}`; // Default fallback
    }
};


  useEffect(() => {
    if (lastNotificationJsonMessage !== null) {
      console.log('Received message:', lastNotificationJsonMessage);
  
      if (lastNotificationJsonMessage.data.userId !== userData.userId) {
        // Check if a notification with the same ID already exists
        const existingNotification = notifications.find(
          (noti) => noti.notificationId === lastNotificationJsonMessage.data.notificationId
        );
  
        if (!existingNotification) {
          // Notification with this ID doesn't exist, so add it to the state
          setNotifications((prevNoti) => [...prevNoti, lastNotificationJsonMessage.data]);
          dispatch(addUserNotification(lastNotificationJsonMessage.data));
        } else {
          console.log("Duplicate notification detected, not adding to state.");
        }
      }

      // Check if it's an action to remove a notification
      if (lastNotificationJsonMessage.action === 'removeNotification') {
        const { notificationId } = lastNotificationJsonMessage.data;
        // Check if the notification exists in the current state
        setNotifications((prevNotifications) => {
            const notificationExists = prevNotifications.some(notification => notification.notificationId === notificationId);
            if (!notificationExists) {
                // If the notification doesn't exist, return the previous state
                return prevNotifications;
            }
            dispatch(deleteUserNotification(notificationId));
            // Update notifications state by filtering out the removed notification
            return prevNotifications.filter((notification) => notification.notificationId !== notificationId);
        });
    }
    }
  }, [lastNotificationJsonMessage]);
  

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuVisible, notificationsVisible, notificationsVisibleForSmallScreen]);
  

    useEffect(() => {
        if (userData && userData.userId) {
            // Fetch notifications when the page first loads (on refresh or initial load)
            const fetchInitialNotifications = async () => {
                try {
                    // Fetch notifications for the logged-in user
                    const initialNotifications = await dynamoService.fetchNotifications(userData.userId);

                    // Set the notifications in the state
                    setNotifications(initialNotifications);
                    dispatch(setUserNotifications(initialNotifications));
                    setLoading(false);  // Set loading to false once data is fetched
                } catch (error) {
                    console.error('Error fetching initial notifications:', error);
                    setLoading(false); // Set loading to false even if an error occurs
                }
            };

            fetchInitialNotifications();
        }
    }, [userData]);

        
    const handleNavigation = (slug) => {
        navigate(slug);
        window.scrollTo(0, 0);
        setMenuVisible(false); 
        setNotificationsVisible(false);
    };

    const handleNotificationClick = (postId, fromUserId) => {
        console.log(postId, fromUserId);
        
        if (postId !== undefined) {
            navigate(`/PoeticOdyssey/post/${postId}`);
        } else {
            navigate(`/PoeticOdyssey/profile/${fromUserId}`);
        }
        setNotificationsVisible(false);
        setNotificationsVisibleForSmallScreen(false)
        setMenuVisible(false)
    };

    const handleDeleteNotification = async (notificationId) => {
        const userId = userData.userId;
        setDeletingNotification(notificationId);
        
        const result = await dynamoService.deleteNotification(userId, notificationId);
        // Update notifications by filtering out the deleted notification
        const updatedNotifications = notifications.filter(noti => noti.notificationId !== notificationId);

        // If there are no notifications left, hide the notifications UI
        if (updatedNotifications.length === 0) {
            setNotificationsVisible(false);
        }

        // Update the state with the new notifications array
        setNotifications(updatedNotifications);

        if (result) {
            dispatch(deleteUserNotification(notificationId));
        }

        setTimeout(() => setDeletingNotification(null), 1000);
    };


    const notificationModalStyle = {
        position: 'absolute',
        right: 0,
        marginTop: '0.5rem',
        width: '20rem',  // Adjusted for small screens
        backdropFilter: 'blur(10px)',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        padding: '1rem',
        zIndex: 500,
        maxHeight: '70vh',  // Allow scrolling for smaller screens
        overflowY: 'auto',
        overflowX: 'hidden',
    };

    const styles = `
        .notification-container {
            max-height: 300px; /* Limit the height */
            overflow-y: auto;  /* Enable vertical scrolling */
            overflow-x: hidden; /* Prevent horizontal scrolling */
            padding: 10px;
            position: relative;
            scrollbar-width: none; /* Hide scrollbar for Firefox */
            -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
        }

        .notification-container::-webkit-scrollbar {
            display: none; /* Hide scrollbar for Chrome, Safari, and Edge */
        }
        .notification-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1); 
            border-radius: 10px;
        }
        .notification-container::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #6a11cb 0%, #2575fc 100%);
            border-radius: 10px; 
            transition: background 0.3s, transform 0.2s;
        }
        .notification-container::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #2575fc 0%, #6a11cb 100%);
            transform: scale(1.1); 
        }

        @keyframes slideOutRight {
            0% {
                transform: translateX(0); 
                opacity: 1;
            }
            100% {
                transform: translateX(100vw);
                opacity: 0;
            }
        }

        .notification-fade-out {
            animation: slideOutRight 6s ease-out forwards;
            position: absolute;
            width: 100%;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return (
        <header className='py-0 shadow-xl sticky top-0 z-50 bg-transparent bg-opacity-80 backdrop-blur-md transition-all duration-500 ease-in-out'>
            <Container>
                <nav className='flex items-center justify-between relative h-44'>
                    {/* Logo and Site Name */}
                    <div className='flex items-center space-x-6'>
                        <Link to="/PoeticOdyssey" className="flex items-center space-x-2">
                            <Logo 
                                width='100px' 
                                className='transition-all duration-700 ease-in-out transform hover:scale-110 relative top-2'
                            />
                            
                        </Link>
                    </div>

                    {/* Navigation Links and Notification Bell for Medium and Large Screens */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Navigation Links */}
                        <div className="flex items-center space-x-6">
                            {navItems.map((item) =>
                                item.active ? (
                                    <Tippy
                                        key={item.slug}
                                        content={<span className="animate-pulse text-white">{getCreativeTitle(item.name)}</span>} // Use a span for animation
                                        placement="top" // Adjust placement as needed (top, bottom, left, right)
                                        theme="dark"   // Choose a theme (optional)
                                        interactive={true} // Allow interaction wi thin the tooltip
                                        delay={[100, 0]}    // Show delay (ms), hide delay (ms)
                                        appendTo={() => document.body} // Append to body to avoid clipping
                                    >
                                        <button
                                            href={item.slug}
                                            className="group  ml-0 mr-0 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full shadow-xl px-5 py-3 transition-all duration-300 ease-in-out hover:bg-gradient-to-l hover:scale-110 hover:rotate-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center space-x-3"
                                            onClick={() => handleNavigation(item.slug)}
                                        >
                                            <FontAwesomeIcon icon={item.icon} className="text-2xl" />
                                        </button>
                                    </Tippy>
                                ) : null
                            )}
                            
                        </div>

                        {
                             /* Notifications Dropdown */
                            authStatus && (
                                <div className="relative" ref={notificationRef}>
                                    <Tippy
                                        key={"Notification"}
                                        content={<span className="animate-pulse w-16 text-white">{getCreativeTitle("Notification")}</span>}
                                        placement="top"
                                        theme="dark"
                                        interactive={true}
                                        delay={[100, 0]}
                                        appendTo={() => document.body}
                                    >
                                        <button
                                            ref={notificationBellRef}
                                            className="relative flex items-center justify-center w-12 h-12 ml-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
                                            onClick={handleNotificationToggle}
                                            aria-label="Toggle notifications"
                                            title={getCreativeTitle("Notification")}
                                        >
                                            <FontAwesomeIcon
                                                icon={faBell} // Use the coffee icon
                                                ref={notificationBellRef}
                                                className="text-3xl text-white cursor-pointer transform hover:scale-125 hover:rotate-12 transition-all duration-300 animate-pulse"
                                                onClick={handleNotificationToggle}
                                                aria-label="Toggle notifications"
                                                size="lg"  // Optional: Adjust the icon size
                                            />
                                        </button>
                                    </Tippy>

                                    {notifications.length > 0 && (
                                        <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-bounce">
                                            {notifications.length}
                                        </span>
                                    )}

                                    {notificationsVisible && (
                                        <div
                                            ref={notificationRef}
                                            className="absolute right-0 mt-2 w-96 bg-gray-800 text-white rounded-lg shadow-xl z-50 transition-transform duration-300 transform scale-100"
                                            style={notificationModalStyle}
                                        >
                                            <ul className="notification-container flex flex-col space-y-2 p-4">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification, index) => {
                                                        return (
                                                            <li
                                                                key={index}
                                                                className="notification-item bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg hover:bg-gradient-to-l hover:scale-105 transition-all duration-500 ease-out flex items-center justify-between px-4 py-2"
                                                            >
                                                                <span
                                                                    onClick={() => handleNotificationClick(notification.postId, notification.senderId)}
                                                                    className="flex-grow cursor-pointer"
                                                                >
                                                                    {notification.message}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleDeleteNotification(notification.notificationId)}
                                                                    className="bg-gradient-to-r from-red-600 to-red-800 text-white ml-2 rounded-full px-4 py-2 transition-transform duration-300 hover:scale-110"
                                                                    aria-label="Delete notification"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: '1.5rem' }} />
                                                                </button>
                                                            </li>
                                                        );
                                                    })
                                                ) : (
                                                    <li className="text-white text-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg px-4 py-2 transition-transform duration-300 hover:scale-105">
                                                        No notifications
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )
                        }


                        {/* Logout Button */}
                        {authStatus && (
                            <LogoutBtn title={getCreativeTitle("Logout")} className="text-lg font-semibold bg-gradient-to-r from-red-600 to-red-800 text-white rounded-full shadow-xl px-6 py-3 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 animate-bounce" />
                        )}
                    </div>

                   {/* Hamburger Icon for Small Screens */}
                    <div ref={menuRef} className="relative flex md:hidden items-center space-x-4">
                        {/* Notification Bell */}
                        {authStatus && (
                            <div className="relative">
                            <button
                                ref={notificationBellRefForSmScreen}
                                className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
                                onClick={handleNotificationToggleForSmallScreen}
                                aria-label="Toggle notifications"
                                title={getCreativeTitle("Notification")}
                            >
                                <FontAwesomeIcon
                                    icon={faBell} // Use the coffee icon
                                    className="text-3xl text-white cursor-pointer transform hover:scale-125 hover:rotate-12 transition-all duration-300 animate-pulse"
                                    size="lg"  // Optional: Adjust the icon size
                                />
                            </button>

                            {notifications.length > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-bounce">
                                {notifications.length}
                                </span>
                            )}
                            </div>
                        )}

                        {/* Notifications Modal */}
                        {notificationsVisibleForSmallScreen && (
                            <div
                            ref={notificationRefForSmScreen}
                            className="absolute min-w-80 bg-gray-800 bg-opacity-90 text-white rounded-lg shadow-lg p-4 top-full left-3/4 transform -translate-x-full mt-2 z-50 max-w-xs w-full"
                            >

                            <ul className="flex flex-col space-y-2">
                                {notifications.length > 0 ? (
                                notifications.map((notification, index) => {
                                    
                                    return (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg px-4 py-2 shadow hover:scale-105 transition-transform duration-300"
                                    >
                                        <span
                                        onClick={() => handleNotificationClick(notification.postId, notification.senderId)}
                                        className="flex-grow cursor-pointer"
                                        >
                                        {notification.message}
                                        </span>
                                        <button
                                        onClick={() => handleDeleteNotification(notification.notificationId)}
                                        className="bg-red-600 text-white rounded-full px-2 py-1 hover:bg-red-700 transition-transform duration-300 hover:scale-110"
                                        aria-label="Delete notification"
                                        >
                                        🗑
                                        </button>
                                    </li>
                                    );
                                })
                                ) : (
                                <li className="text-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg px-4 py-2">
                                    No notifications
                                </li>
                                )}
                            </ul>
                            </div>
                        )}

                        {/* Hamburger Menu */}
                        <button
                            className="flex items-center justify-center w-14 h-14 bg-gradient-to-l from-indigo-500 to-purple-600 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
                            onClick={handleMenuToggle}
                            aria-label="Toggle navigation"
                        >
                            ☰
                        </button>

                        {/* Menu Modal */}
                        {
                            menuVisible && (
                                <div className="absolute right-0 mt-24 -top-3 bg-gray-800 bg-opacity-90 rounded-3xl shadow-2xl p-6 z-50 max-w-md animate-fade-in">
                                    <ul className="flex flex-col">
                                        {navItems.map((item) =>
                                             item.active ? (
                                                <Tippy
                                                    key={item.slug}
                                                    content={<span className="animate-pulse text-white">{getCreativeTitle(item.name)}</span>} // Use a span for animation
                                                    placement="left" // Adjust placement as needed (top, bottom, left, right)
                                                    theme="dark"   // Choose a theme (optional)
                                                    interactive={true} // Allow interaction within the tooltip
                                                    delay={[100, 0]}    // Show delay (ms), hide delay (ms)
                                                    appendTo={() => document.body}
                                                >
                                                    <button
                                                        href={item.slug}
                                                        className="group text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full shadow-xl px-6 py-3 transition-all duration-300 ease-in-out hover:bg-gradient-to-l hover:scale-110 hover:rotate-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center space-x-3"
                                                        onClick={() => handleNavigation(item.slug)}
                                                    >
                                                        <FontAwesomeIcon icon={item.icon} className="text-2xl" />
                                                    </button>
                                                </Tippy>
                                            ) : null
                                        )}
                                        {authStatus && (
                                            <li className="animate-slide-in">
                                                <LogoutBtn handleMenuToggle={handleMenuToggle} title={getCreativeTitle("Logout")} />                                        
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )
                        }

                    </div>

                </nav>
            </Container>
        </header>
    );
});

export default Header;
