import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherAlt, faPenFancy } from '@fortawesome/free-solid-svg-icons';

const HeroSection = ({ userInfoData }) => {
  return (
    <div className="hero-section text-white ">
      <div className="text-center p-4 waving-banner"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(5px)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'inline-block',
          width: 'fit-content',
        }}>
        <h1 className="p-1 text-4xl font-bold mb-4 relative overflow-hidden text-sky-700">
          Welcome to Poetic Odyssey,
          <span className="username-animated inline-block p-1 text-teal-500">
            {userInfoData?.name || "Wanderer"}
          </span>
        </h1>
        <div>
          <p className="text-xl italic text-gray-300 waving-animation relative pl-4 pr-4 pt-2 pb-2"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(5px)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'inline-block',
              width: 'fit-content',
            }}>
            <FontAwesomeIcon icon={faFeatherAlt} className="mr-2 animate-pulse text-2xl" title="Crafting words" color='rgba(255, 255, 255, 0.8)' />{' '}
            Embark on a journey of words, where every verse tells a story.
            <FontAwesomeIcon icon={faPenFancy} className="ml-2 animate-pulse text-2xl" title="Exploring new worlds" />{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;