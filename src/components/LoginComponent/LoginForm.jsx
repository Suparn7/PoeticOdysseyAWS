import React from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';

const LoginForm = ({ onSubmit, showPassword, setShowPassword }) => {
    const { register, handleSubmit } = useForm();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
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

            <Button
                type="submit"
                className="ml-0 w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 transform hover:scale-105"
            >
                Sign In
            </Button>
        </form>
    );
};

export default LoginForm;