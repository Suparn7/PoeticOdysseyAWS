import { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authService from './appwrite/auth';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { login, logout } from './store/authSlice';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'; // Import ErrorBoundary
import CreateBlog from './components/awsComponent/CreateBlog';
import dynamoService from './aws/dynamoService';
import awsAuthService from './aws/awsAuthService';
import { setUserData, clearUserData } from './store/userSlice';
import dynamoUserInformationService from './aws/dynamoUserInformationService';
import { setPosts } from './store/postSlice';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import useWebSocketService from './webSocketServices/useWebSocketService';

function App() {
    // const [loading, setLoading] = useState(true);
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     // Step 1: Check current user
    //     awsAuthService.getCurrentUser()
    //         .then(async (userData) => {
    //             if (userData) {
    //                 dispatch(login({ userData }));
                    
    //                 // Step 2: Fetch additional user data from DynamoDB
    //                 const fullUserData = await dynamoUserInformationService.getUserInfoByUserNameId(userData.username);

    //                 if (fullUserData) {
    //                     // Step 3: Dispatch full user data to Redux
    //                     dispatch(setUserData(fullUserData));
    //                     // Step 4: Fetch all the posts created by user
    //                     if (fullUserData.postsCreated.length > 0) {
    //                         const posts = await dynamoService.getPostsByIds(fullUserData.postsCreated);
                            
    //                         // Step 5: Fetch comments for each post
    //                         const postsWithComments = await Promise.all(posts.map(async (post) => {
    //                             const comments = await dynamoService.getCommentsByPostId(post.blogId);
    //                             return { ...post, comments }; // Combine post with its comments
    //                         }));

    //                         dispatch(setPosts(postsWithComments)); // Dispatch posts with comments
    //                     }
    //                 }
    //             } else {
    //                 console.log("No user found, logging out.");
    //                 dispatch(logout());
    //                 dispatch(clearUserData());
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Error retrieving user data:", error);
    //             dispatch(logout());
    //             dispatch(clearUserData());
    //         })
    //         .finally(() => setLoading(false));
    // }, [dispatch]);

    const userData = useSelector((state) => state.user.userData);
    const [notificationSocketUrl, setNotificationSocketUrl] = useState(null);

    useEffect(() => {
        if (userData?.userId) {
            setNotificationSocketUrl(`wss://l8eegkbrkd.execute-api.ap-south-1.amazonaws.com/production/?userId=${userData.userId}`);
        }
    }, [userData]);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocketService(notificationSocketUrl);
        console.log("socket call received! inisde apppp", sendJsonMessage, lastJsonMessage, readyState);


    return (
        <ErrorBoundary> {/* Wrap with ErrorBoundary */}
            <div className='min-h-screen flex flex-col bg-cover bg-center' style={{ backgroundImage: 'url(https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg)' }}>
                <HeaderComponent sendJsonMessage={sendJsonMessage} lastJsonMessage={lastJsonMessage} readyState={readyState} />
                <main className='flex-grow transition-transform duration-300'>
                    <Outlet />
                </main>
                <Footer className="bg-black bg-opacity-50" />
            </div>
        </ErrorBoundary>
    )
}

export default App;
