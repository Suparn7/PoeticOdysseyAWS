import React from 'react'
import Button from '../Button'

const ConfirmCancel = ({confirmCancel, cancel}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50 animate__animated animate__fadeIn animate__faster">
        <div
            className="bg-gray-800 text-white rounded-lg p-6 shadow-lg transform scale-105 animate__animated animate__zoomIn relative overflow-hidden" // Added relative and overflow-hidden for the glow
            style={{
                maxWidth: '400px',
                width: '90%',
                opacity: 1,
                transition: 'opacity 0.5s',
            }}
        >
            {/* Glowing Background Effect */}
            <div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 opacity-20 blur-lg z-0"
                style={{
                    animation: 'pulseGlow 10s infinite alternate',
                }}
            ></div>
            <h2 className="text-xl font-bold mb-4 animate__animated animate__fadeIn relative z-10">
                Are you sure you want to cancel?
            </h2>
            <div className="flex justify-between animate__animated animate__fadeIn animate__delay-1s relative z-10">
                <Button
                    onClick={confirmCancel}
                    className="bg-red-500 hover:bg-red-600 transform hover:scale-105 transition-all animate__animated animate__pulse animate__infinite"
                >
                    Yes, Cancel
                </Button>
                <Button
                    onClick={cancel}
                    className="bg-blue-500 hover:bg-blue-600 transform hover:scale-105 transition-all animate__animated animate__pulse animate__infinite"
                >
                    No, Stay
                </Button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmCancel
