import React from 'react';

const CommentHeader = () => {
    return (
        <div className='-mb-3'
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <h3
                className="text-2xl font-bold text-yellow-300"
                style={{
                    padding: '10px 20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '40px',
                    textAlign: 'center',
                    display: 'inline-block',
                    minWidth: "195px"
                }}
            >
                Comments
            </h3>
        </div>
    );
};

export default CommentHeader;