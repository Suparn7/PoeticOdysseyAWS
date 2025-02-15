import React from 'react';
import Container from '../container/Container';
import NavigationLinks from './LargeAndMdScreen/NavigationLinks';
import NotificationButton from './LargeAndMdScreen/NotificationButton';
import SmNotificationsModal from './SmallScreenHeader/SmNotificationsModal';
import LgMdNotificationsModal from './LargeAndMdScreen/LgMdNotificationsModal';
import NotificationBadge from './LargeAndMdScreen/NotificationBadge';
import LogoutBtn from './LogoutBtn';
import NotificationBell from './SmallScreenHeader/NotificationBell';
import HamburgerMenuButton from './SmallScreenHeader/HamburgerMenuButton';
import LogoAndSiteName from './LargeAndMdScreen/LogoAndSiteName';
import MenuModal from './SmallScreenHeader/MenuModal';

const HeaderContent = ({
    navItems,
    getCreativeTitle,
    handleNavigation,
    authStatus,
    notificationRef,
    notificationBellRef,
    handleNotificationToggle,
    notifications,
    notificationsVisible,
    handleNotificationClick,
    handleDeleteNotification,
    notificationModalStyle,
    menuRef,
    notificationBellRefForSmScreen,
    handleNotificationToggleForSmallScreen,
    notificationsVisibleForSmallScreen,
    notificationRefForSmScreen,
    handleMenuToggle,
    menuVisible
}) => {
    return (
        <header className='py-0 shadow-xl sticky top-0 z-50 bg-transparent bg-opacity-80 backdrop-blur-md transition-all duration-500 ease-in-out'>
            <Container>
                <nav className='flex items-center justify-between relative h-44'>
                    {/* Logo and Site Name */}
                    <LogoAndSiteName />

                    {/* Navigation Links and Notification Bell for Medium and Large Screens */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Navigation Links */}
                        <NavigationLinks
                            navItems={navItems}
                            getCreativeTitle={getCreativeTitle}
                            handleNavigation={handleNavigation}
                        />

                        {/* Notifications Dropdown */}
                        {authStatus && (
                            <div className="relative" ref={notificationRef}>
                                <NotificationButton
                                    notificationBellRef={notificationBellRef}
                                    handleNotificationToggle={handleNotificationToggle}
                                    getCreativeTitle={getCreativeTitle}
                                />

                                {notifications.length > 0 && (
                                    <NotificationBadge notifications={notifications} />
                                )}

                                {notificationsVisible && (
                                    <LgMdNotificationsModal
                                        notificationsVisible={notificationsVisible}
                                        notificationRef={notificationRef}
                                        notifications={notifications}
                                        handleNotificationClick={handleNotificationClick}
                                        handleDeleteNotification={handleDeleteNotification}
                                        notificationModalStyle={notificationModalStyle}
                                    />
                                )}
                            </div>
                        )}

                        {/* Logout Button */}
                        {authStatus && (
                            <LogoutBtn title={getCreativeTitle("Logout")} className="text-lg font-semibold bg-gradient-to-r from-red-600 to-red-800 text-white rounded-full shadow-xl px-6 py-3 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 animate-bounce" />
                        )}
                    </div>

                    {/* Hamburger Icon for Small Screens */}
                    <div ref={menuRef} className="relative flex md:hidden items-center space-x-4">
                        {/* Notification Bell */}
                        {authStatus && (
                            <NotificationBell
                                notifications={notifications}
                                notificationBellRef={notificationBellRefForSmScreen}
                                handleNotificationToggle={handleNotificationToggleForSmallScreen}
                                getCreativeTitle={getCreativeTitle}
                            />
                        )}

                        {/* Notifications Modal */}
                        {notificationsVisibleForSmallScreen && (
                            <SmNotificationsModal
                                notificationsVisible={notificationsVisibleForSmallScreen}
                                notificationRef={notificationRefForSmScreen}
                                notifications={notifications}
                                handleNotificationClick={handleNotificationClick}
                                handleDeleteNotification={handleDeleteNotification}
                            />
                        )}

                        {/* Hamburger Menu */}
                        <HamburgerMenuButton handleMenuToggle={handleMenuToggle} />

                        {/* Menu Modal */}
                        {menuVisible && (
                            <MenuModal
                                menuVisible={menuVisible}
                                navItems={navItems}
                                getCreativeTitle={getCreativeTitle}
                                handleNavigation={handleNavigation}
                                authStatus={authStatus}
                                handleMenuToggle={handleMenuToggle}
                            />
                        )}
                    </div>
                </nav>
            </Container>
        </header>
    );
};

export default HeaderContent;