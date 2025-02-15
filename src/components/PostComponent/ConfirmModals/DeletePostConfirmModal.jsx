import React from 'react'
import Button from '../../Button'
import { deletePost } from '../../../actions/postActions';

const DeletePostConfirmModal = ({post, dispatch, navigate, setShowConfirm, userData}) => {
    const handleConfirmDelete = () => {
        deletePost(post, userData, dispatch, navigate);
        setShowConfirm(false);
    };
    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className=" relative -top-96 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white rounded-lg p-8 shadow-2xl max-w-lg w-full z-60 transform transition-all animate-slideInLeft animate-popIn animate-glowingModal animate-tiltIn">
            <h2 className="text-2xl font-extrabold mb-6 text-center text-yellow-400 animate-bounce animate-neonGlow">
                Are you sure you want to delete this post?
            </h2>
            <div className="flex justify-center gap-6">
                <Button
                    onClick={handleConfirmDelete}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform hover:scale-110 transition duration-300 ease-in-out animate-popIn animate-buttonGlow animate-neonPulse"
                >
                    Yes, Delete
                </Button>
    
                <Button
                    onClick={handleCancelDelete}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform hover:scale-110 transition duration-300 ease-in-out animate-popIn animate-buttonGlow animate-neonPulse"
                >
                    No, Cancel
                </Button>
            </div>
        </div>
    </div>
  )
}

export default DeletePostConfirmModal
