import React from 'react';

const NoPostsBanner = () => {
  return (
    <div className="no-posts-banner text-center mt-12 waving-banner">
      <div className="max-w-md mx-auto bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-white font-semibold">
              Get Started!
            </div>
            <p className="mt-2 text-white">
              No posts available. Add a post to get started!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoPostsBanner;