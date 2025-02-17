import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Logo from '../Logo';
import awsAuthService from '../../aws/awsAuthService';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import { setUserData } from '../../store/userSlice';
import '../../styles/loader.css';
import Container from '../container/Container';
import ConfirmEmail from '../awsComponent/ConfirmEmail';
import SignupForm from './SignupForm';
import PasswordModal from './PasswordModal';
import ErrorMessage from './ErrorMessage';
import ConfirmEmailModal from './ConfirmEmailModal';

const SignupComponent = () => {
    const { register, handleSubmit, watch } = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [showConfirmEmailModal, setShowConfirmEmailModal] = useState(false);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [bio, setBio] = useState("")
    const [phone, setPhone] = useState("")
    const [name, setName] = useState("")
    const [userSub, setUserSub] = useState("")

    const profilePic = watch("profilePic");

    // Watch for changes in the profile picture input
    React.useEffect(() => {
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

    const create = async (data) => {
        setError("");
        setLoading(true);

        try {
            // Step 1: Create an account with AWS Cognito
            const userInfo = await awsAuthService.createAccount({
                email: data.email,
                password: data.password,
                name: data.name,
            });
            setUserSub(userInfo.userSub)

            // Do not upload image yet
            let uploadedUrl = "";
            setName(data.name)
            setEmail(data.email);
            setPassword(data.password);
            setBio(data.bio);
            setPhone(data.phone);
            // Step 2: Notify the user to confirm their email
            setError("Please confirm your email before logging in.");
            setShowConfirmEmailModal(true); // Show the confirmation modal

        } catch (err) {
            console.log("err", err);
            setError(err.message || "An error occurred during account creation.");
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
            <div className="relative w-11/12 max-w-2xl bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                    <Logo width="100px" />
                    <h2 className="text-3xl font-bold text-white mt-4">Create an Account</h2>
                    <p className="text-gray-300 ">
                        Already have an account?{' '}
                        <Link to="/PoeticOdyssey/login" className="text-green-400 underline hover:text-green-500">
                            Sign In
                        </Link>
                    </p>
                </div>

                <ErrorMessage error={error} />

                <SignupForm
                    onSubmit={handleSubmit(create)}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    profilePicPreview={profilePicPreview}
                    register={register}
                    watch={watch}
                />
            </div>

            {showConfirmEmailModal && (
                <ConfirmEmailModal
                    email={email}
                    password={password}
                    profilePic={profilePic}
                    bio={bio}
                    phone={phone}
                    name={name}
                    userSub={userSub}
                    onClose={() => setShowConfirmEmailModal(false)}
                />
            )}
        </div>
    );
};

export default SignupComponent;