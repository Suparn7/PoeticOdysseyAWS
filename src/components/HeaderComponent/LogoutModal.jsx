import React from 'react';

const LogoutModal = ({ confirmLogout, cancelLogout }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 animate-glowBackground">
               <div className="bg-gradient-to-r mb-72 from-gray-800 via-gray-700 to-gray-900 text-white rounded-lg p-8 shadow-2xl max-w-lg w-10/12 z-60 transform transition-all animate-slideInLeft animate-popIn animate-glowingModal animate-tiltIn">
                   <h2 className="text-2xl font-extrabold mb-6 text-center text-yellow-400 animate-bounce animate-neonGlow">
                       Are you sure you want to logout?
                   </h2>
                   <div className="flex justify-center gap-6">
                       <button
                           onClick={confirmLogout}
                           className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-110 transition duration-300 ease-in-out animate-popIn animate-buttonGlow animate-neonPulse"
                       >
                           Yes, Logout
                       </button>
           
                       <button
                           onClick={cancelLogout}
                           className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-110 transition duration-300 ease-in-out animate-popIn animate-buttonGlow animate-neonPulse"
                       >
                           No, Stay
                       </button>
                   </div>
               </div>
           </div>
    );
};

export default LogoutModal;