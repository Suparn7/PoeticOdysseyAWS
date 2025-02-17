import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Logo from '../Logo';
import awsAuthService from '../../aws/awsAuthService';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../../store/authSlice';
import { setUserData } from '../../store/userSlice';
import '../../styles/loader.css';
import Container from '../container/Container';
import dynamoUserInformationService from '../../aws/dynamoUserInformationService';
import dynamoService from '../../aws/dynamoService';
import { setPosts } from '../../store/postSlice';
import LoginForm from './LoginForm';
import ErrorMessage from './ErrorMessage';

const LoginComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const login = async (data) => {
        setError("");
        setLoading(true);
        try {
            const session = await awsAuthService.login(data);
            if (session) {
                const userData = await awsAuthService.getCurrentUser();
                if (userData) {
                    const userDetails = await dynamoUserInformationService.getUserInfoByUserNameId(userData.username);
                    console.log(userDetails);
                    
                    dispatch(setUserData(userDetails));
                    dispatch(authLogin({ userData }));

                    // Fetch all the posts created by user
                    if (userDetails.postsCreated.length > 0) {
                        const posts = await dynamoService.getPostsByIds(userDetails.postsCreated);
                        
                        // Fetch comments for each post
                        const postsWithComments = await Promise.all(posts.map(async (post) => {
                            const comments = await dynamoService.getCommentsByPostId(post.blogId);
                            return { ...post, comments }; // Combine post with its comments
                        }));

                        dispatch(setPosts(postsWithComments)); // Dispatch posts with comments
                    }
                }
                navigate("/PoeticOdyssey");
                window.scrollTo(0, 0);
            }
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
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

    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <div className="relative w-11/12 max-w-lg bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                    <Logo width="100px" />
                </div>

                <ErrorMessage error={error} />

                <h2 className="text-center text-3xl font-bold text-white mt-4">Sign In to Your Account</h2>
                <p className="text-gray-300 text-center mt-2">
                    Don’t have an account?{' '}
                    <Link to="/PoeticOdyssey/signup" className="text-green-400 underline hover:text-green-500">
                        Sign Up
                    </Link>
                </p>

                <LoginForm
                    onSubmit={login}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />
            </div>
        </div>
    );
};

export default LoginComponent;