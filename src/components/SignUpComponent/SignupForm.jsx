import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ProfilePicUpload from './ProfilePicUpload';
import Button from '../Button';
import './styles/signupform.css'

const SignupForm = ({ onSubmit, error, watch, register }) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <input
                        {...register("name", { required: true })}
                        type="text"
                        placeholder="Full Name"
                        className="w-full bg-white bg-opacity-20 text-white rounded-lg py-3 px-10 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                    <FontAwesomeIcon
                        icon={faUser}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                </div>
                <div className="relative">
                    <input
                        {...register("email", { required: true })}
                        type="email"
                        placeholder="Email"
                        className="w-full bg-white bg-opacity-20 text-white rounded-lg py-3 px-10 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                    <FontAwesomeIcon
                        icon={faEnvelope}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                </div>
            </div>

            <div className="relative">
                <input
                    {...register("phone")}
                    type="text"
                    placeholder="Phone (optional)"
                    className="w-full bg-white bg-opacity-20 text-white rounded-lg py-3 px-10 focus:ring-2 focus:ring-green-400 outline-none"
                />
                <FontAwesomeIcon
                    icon={faPhone}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
            </div>

            <div className="relative">
                <input
                    {...register("password", { required: true })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full bg-white bg-opacity-20 text-white rounded-lg py-3 px-10 focus:ring-2 focus:ring-green-400 outline-none"
                />
                <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer eye-icon ${showPassword ? 'eye-icon-hide' : 'eye-icon-show'}`}
                    onClick={togglePasswordVisibility}
                />
            </div>

            <ProfilePicUpload register={register} watch={watch} />

            <textarea
                {...register("bio")}
                placeholder="Tell us a little about yourself..."
                className="w-full bg-white bg-opacity-20 text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-400 outline-none"
            />

            {error && (
                <div className="w-full bg-red-700 bg-opacity-20 backdrop-blur-md rounded-lg p-4 text-red-200 text-center shadow-md mb-6">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="ml-0 w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 transform hover:scale-105"
            >
                Create Account
            </Button>
        </form>
    );
};

export default SignupForm;