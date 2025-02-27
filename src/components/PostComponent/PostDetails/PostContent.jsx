import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import parse from 'html-react-parser';

const PostContent = ({ post, author, userData }) => {
    return (
        <div
            className="flex items-center justify-center text-center px-3 text-sm text-gray-200 mt-2  shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            style={{
                maxHeight: '300px',
                minHeight: '300px',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '10px',
                border: '1px solid #ffffff',
                borderRadius: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                wordWrap: 'break-word',
            }}
            onCopy={(e) => {
                if (author.userId !== userData.userId) {
                    e.preventDefault();
                    const { clientX, clientY } = e.nativeEvent;
                    toast.warn('Only the author can copy the content.', {
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        icon: '⚠️',
                        style: {
                            position: 'absolute',
                            top: `${clientY - 50}px`,
                            left: `${clientX}px`,
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #ff7eb3, #ff758c)',
                            color: '#fff',
                            padding: '16px',
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '16px',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        },
                    });
                }
            }}
        >
            {parse(post.content)}
            <ToastContainer />
        </div>
    );
};

export default PostContent;